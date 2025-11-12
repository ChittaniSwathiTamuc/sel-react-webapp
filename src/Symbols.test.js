import { render, screen, cleanup } from "@testing-library/react";
import Symbols from "./Symbols";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

// Mock environment variables
process.env.REACT_APP_API_SYMBOLS_URL = "https://mockapi.test/symbols";
process.env.REACT_APP_USERNAME = "testUser";
process.env.REACT_APP_PASSWORD = "testPass";

describe("🧪 Symbols Component Tests", () => {
  beforeEach(() => {
    cleanup();

    // Mock fetch for both metadata and details
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("?filter=SystemTags")) {
        // Metadata call
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { symbolName: "SYM1", description: "Symbol One", type: "INS" },
              { symbolName: "SYM2", description: "Symbol Two", type: "INS" },
              { symbolName: "SYM3", description: "Symbol Three", type: "OTH" },
            ]),
        });
      }

      if (url.includes("/SYM1")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ stVal: 111, t: "2025-11-11T10:00:00Z" }),
        });
      }
      if (url.includes("/SYM2")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ stVal: 222, t: "2025-11-11T10:01:00Z" }),
        });
      }

      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });

    // Mock setInterval to execute immediately
    jest.spyOn(global, "setInterval").mockImplementation((cb) => {
      cb();
      return 1;
    });
    jest.spyOn(global, "clearInterval").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders component header", async () => {
    render(<Symbols />);
    expect(await screen.findByText("📋 Live Symbol Data")).toBeInTheDocument();
  });

  test("fetches and filters only INS-type symbols", async () => {
    render(<Symbols />);

    expect(await screen.findByText("SYM1")).toBeInTheDocument();
    expect(await screen.findByText("SYM2")).toBeInTheDocument();
    expect(screen.queryByText("SYM3")).not.toBeInTheDocument();
  });

  test("fetches live symbol details correctly", async () => {
    render(<Symbols />);
    expect(await screen.findByText("111")).toBeInTheDocument();
    expect(await screen.findByText("222")).toBeInTheDocument();
  });

  test("auto-refresh triggers immediately (interval mocked)", async () => {
    render(<Symbols />);
    expect(global.fetch).toHaveBeenCalled();
  });

  test("handles failed API calls gracefully", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve({}) })
    );

    render(<Symbols />);
    expect(await screen.findByText("📋 Live Symbol Data")).toBeInTheDocument();
  });

  test("handleSort toggles direction when clicking same header (covers lines ~109-110)", async () => {
    // Provide two symbols with different stVal so sorting is meaningful
    jest.spyOn(global, "fetch").mockImplementation((url) => {
      if (url.includes("?filter=SystemTags")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              { symbolName: "A", description: "Alpha", type: "INS" },
              { symbolName: "B", description: "Beta", type: "INS" },
            ]),
        });
      }
      if (url.includes("/A")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ stVal: 1, t: null }) });
      }
      if (url.includes("/B")) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ stVal: 2, t: null }) });
      }
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });

    render(<Symbols />);
    // wait for table values to render
    expect(await screen.findByText("1")).toBeInTheDocument();

    const valueHeader = screen.getByText(/Value/);

    // First click: should set direction to ascending -> arrow ▲
    await userEvent.click(valueHeader);
    await waitFor(() => {
      expect(valueHeader.textContent).toContain("▲");
    });

    // Second click: should toggle to descending -> arrow ▼
    await userEvent.click(valueHeader);
    await waitFor(() => {
      expect(valueHeader.textContent).toContain("▼");
    });
  });

  test("metadata fetch rejects -> component handles error (covers fetchSymbolsData catch)", async () => {
    // Simulate fetch rejecting (network error)
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error("network fail")));

    render(<Symbols />);

    // Component should still render header and not crash
    expect(await screen.findByText("📋 Live Symbol Data")).toBeInTheDocument();

    // Optionally assert fetch was called
    expect(global.fetch).toHaveBeenCalled();
  });

 test("clicking each header invokes handleSort and renders an arrow (covers header onClick & getSortArrow)", async () => {
  // simple metadata so table renders
  jest.spyOn(global, "fetch").mockImplementation((url) => {
    if (url.includes("?filter=SystemTags")) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { symbolName: "H1", description: "Desc1", type: "INS" },
            { symbolName: "H2", description: "Desc2", type: "INS" },
          ]),
      });
    }
    if (url.includes("/H1")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ stVal: 1, t: null }) });
    if (url.includes("/H2")) return Promise.resolve({ ok: true, json: () => Promise.resolve({ stVal: 2, t: null }) });
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  });

  render(<Symbols />);
  // wait until table is present
  expect(await screen.findByText("1")).toBeInTheDocument();

  const headers = {
    symbolName: screen.getByText(/Symbol Name/),
    description: screen.getByText(/Description/),
    stVal: screen.getByText(/^Value\b/),
    t: screen.getByText(/Date & Time/),
  };

  // Click each header and assert *some* arrow appears (▲ or ▼)
  for (const key of Object.keys(headers)) {
    await userEvent.click(headers[key]);
    await waitFor(() => {
      expect(headers[key].textContent).toMatch(/[▲▼]/);
    });
  }
});

});

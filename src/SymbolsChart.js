import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchSymbolsRequest,
  fetchSymbolsSuccess,
  fetchSymbolsFailure,
} from "./Redux/Action";
import "./selStyle.css";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const SymbolsChart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const symbolEndpoint = process.env.REACT_APP_API_SYMBOLS_SEL_URL;
  const userName = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;

  const token = btoa(`${userName}:${password}`);
  const { symbols } = useSelector((state) => state.symbols);

  const [symbolMetadata, setSymbolMetadata] = useState([]);
  const [liveSymbols, setLiveSymbols] = useState([]);

  // ---------------------------
  // Fetch list of symbols
  // ---------------------------
  const fetchSymbolsData = async () => {
    dispatch(fetchSymbolsRequest());

    try {
      const filterValue = encodeURIComponent("SystemTags*");

      const response = await fetch(
        `${symbolEndpoint}?filter=${filterValue}&sort=asc`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      console.log("respbody:", response.body);
      const data = await response.json();
      dispatch(fetchSymbolsSuccess(data));
    } catch (error) {
      dispatch(fetchSymbolsFailure(error.message));
    }
  };

  useEffect(() => {
    fetchSymbolsData();
  }, []);

  // ---------------------------
  // Filter INS symbols
  // ---------------------------
  useEffect(() => {
    if (symbols && symbols.length > 0) {
      const filtered = symbols
        .filter((s) => s.Type === "INS")
        .map((s) => ({
          Name: s.Name,
          Description: s.Description,
          Type: s.Type,
        }));

      setSymbolMetadata(filtered);
    }
  }, [symbols]);

  // ---------------------------
  // Fetch live values in parallel
  // ---------------------------
  const fetchSymbolDetails = async () => {
    if (!symbolMetadata || symbolMetadata.length === 0) return;

    try {
      const promises = symbolMetadata.map((symbol) =>
        fetch(`${symbolEndpoint}/${symbol.Name}`, {
          method: "GET",
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
          .then(async (res) => {
            if (!res.ok) return null;
            const data = await res.json();

            return {
              Name: symbol.Name,
              Description: symbol.Description,
              Type: symbol.Type,
              stVal: data.stVal,
              t: data.t?.value ?? data.t, // handles both formats
            };
          })
          .catch(() => null)
      );

      const results = await Promise.all(promises);

      // Remove null entries
      setLiveSymbols(results.filter(Boolean));
    } catch (error) {
      console.error("Symbol details fetch error:", error);
    }
  };

  // Auto-refresh every 2 seconds
  useEffect(() => {
    if (!symbolMetadata || symbolMetadata.length === 0) return;

    fetchSymbolDetails();
    const interval = setInterval(fetchSymbolDetails, 2000);

    return () => clearInterval(interval);
  }, [symbolMetadata]);

  // ---------------------------
  // UI + Charts
  // ---------------------------
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
       <button
        onClick={() => navigate("/")}
        style={{ marginBottom: 20 }}
      >
        Go to Table View
      </button>
      <h1>📈 Live Symbol Data</h1>

      {liveSymbols.length === 0 && <p>Loading symbols...</p>}

      {liveSymbols.map((symbol) => {
        const chartData = [
          {
            time: new Date(symbol.t).toLocaleTimeString(),
            value: symbol.stVal,
          },
        ];

        return (
          <div
            key={symbol.Name}
            style={{
              marginBottom: "40px",
              padding: "15px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            <h3>
              {symbol.Name} — <small>{symbol.Description}</small>
            </h3>

            <p>
              <strong>Value:</strong> {symbol.stVal} &nbsp; | &nbsp;
              <strong>Time:</strong>{" "}
              {new Date(symbol.t).toLocaleTimeString()}
            </p>

            <LineChart width={600} height={250} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#007bff"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </div>
        );
      })}
    </div>
  );
};

export default SymbolsChart;

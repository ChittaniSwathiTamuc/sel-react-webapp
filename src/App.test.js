import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Symbols component header', async () => {
  render(<App />);
  expect(await screen.findByText("📋 Live Symbol Data")).toBeInTheDocument();
});

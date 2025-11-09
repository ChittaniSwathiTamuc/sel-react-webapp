import React, {useEffect, useState, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSymbolsRequest, fetchSymbolsSuccess, fetchSymbolsFailure} from "./Redux/Action";
import './selStyle.css';
import { Chart, ChartContainer } from "react-charts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Symbols = () => {
    const dispatch= useDispatch();
    const symbolEndpoint = "https://localhost:7081/logic-engine/symbols";
    const userName = 'johnDoe';
    const password = 'pass123';
    const token = btoa(`${userName}:${password}`);
    const { symbols } = useSelector((state)=> state.symbols);
    const [symbolMetadata, setSymbolMetadata] = useState([]);
     const [liveSymbols, setLiveSymbols] = useState([]);
     const [sortConfig, setSortConfig] = useState({ key: "symbolName", direction: "asc" });

    const fetchSymbolsData = async()=>{
        dispatch(fetchSymbolsRequest());
        try{
            const response = await fetch(`${symbolEndpoint}?filter=SystemTags&sort=asc`, {
                method: "GET",
                headers: {
                    "Authorization" : `Basic ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            if(!response.ok) {
                throw new Error (`HTTP Error : ${response.status}`)
            }

            const data = await response.json();
            dispatch(fetchSymbolsSuccess(data));

        }catch(error) {
            dispatch(fetchSymbolsFailure(error.message));
        };
    }

    useEffect(()=>{
        fetchSymbolsData();
    },[]);

    useEffect(()=>{
        if(symbols && symbols.length >0 ) {
            const filteredSymbols = symbols.filter((symbol)=> symbol.type === 'INS')
            .map((item)=>({
                symbolName: item.symbolname,
                description: item.description,
                type: item.type
            }));
            setSymbolMetadata(filteredSymbols);
        }
    },[symbols]);

    const fetchSymbolDetails = async() => {
        const updatedList = [];
        if (!symbolMetadata || symbolMetadata.Length === 0) return;
        for(const symbol of symbolMetadata){
            try{
                const responseData = await fetch(`${symbolEndpoint}/${symbol.symbolName}`, {
                    method : "GET",
                    headers: {
                        "Authorization": `Basic ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });
                if (!responseData.ok) continue;
                const symboldata = await responseData.json();
                console.log('symb:',symboldata);
                updatedList.push({
                    symbolName: symbol.symbolName,
                    description: symbol.description,
                    type: symbol.type,
                    stVal: symboldata.stVal,
                    t: symboldata.t
                });

            }
            catch(error){
                console.warn(`⚠️ Skipped ${symbol.symbolName} — invalid json`);
                continue;
            }
        }
        setLiveSymbols(updatedList);
    };

    useEffect(()=> {
        if(!symbolMetadata || symbolMetadata.Length ===0 ) return;
        fetchSymbolDetails();
        const interval = setInterval(()=> {
            fetchSymbolDetails();
        },2000)

        return(()=> clearInterval(interval))

    },[symbolMetadata]);

     // Get sort arrow
  const getSortArrow = (key) =>
    sortConfig.key === key ? (sortConfig.direction === "asc" ? "▲" : "▼") : "";

    // Simple sorting logic
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sorted = useMemo(() => {
    return [...liveSymbols].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [liveSymbols, sortConfig]);

  // 🟢 Minimal UI
   return (
    <div className="container">
      <h2>📋 Live Symbol Data</h2>

      {sorted.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table className="symbol-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("symbolName")}>
                Symbol Name {getSortArrow("symbolName")}
              </th>
              <th onClick={() => handleSort("description")}>
                Description {getSortArrow("description")}
              </th>
              <th onClick={() => handleSort("stVal")}>
                Value {getSortArrow("stVal")}
              </th>
              <th onClick={() => handleSort("t")}>
                Date & Time {getSortArrow("t")}
              </th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((s) => (
              <tr key={s.symbolName}>
                <td>{s.symbolName}</td>
                <td>{s.description}</td>
                <td>{s.stVal}</td>
                <td>{new Date(s.t).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
//   return (
//     <div style={{ padding: 20, fontFamily: "Arial" }}>
//       <h2>📋 Live Symbol Data</h2>
//       {sorted.length === 0 ? (
//         <p>Loading...</p>
//       ) : (
//         <table border="1" cellPadding="6" cellSpacing="0" width="100%">
//           <thead>
//             <tr>
//               <th onClick={() => handleSort("symbolName")}>Symbol Name</th>
//               <th onClick={() => handleSort("description")}>Description</th>
//               <th onClick={() => handleSort("stVal")}>Value</th>
//               <th onClick={() => handleSort("t")}>Time</th>
//             </tr>
//           </thead>
//           <tbody>
//             {sorted.map((s) => (
//               <tr key={s.symbolName}>
//                 <td>{s.symbolName}</td>
//                 <td>{s.description}</td>
//                 <td>{s.stVal}</td>
//                 <td>{new Date(s.t).toLocaleTimeString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );

     // ✅ Single clean return for UI + charts
//   return (
//     <div style={{ padding: "20px", fontFamily: "Arial" }}>
//       <h1>📈 Live Symbol Data</h1>

//       {liveSymbols.length === 0 && <p>Loading symbols...</p>}

//       {liveSymbols.map((symbol) => {
//         // Chart expects array of objects [{ time, value }]
//         const chartData = [
//           {
//             time: new Date(symbol.t).toLocaleTimeString(),
//             value: symbol.stVal,
//           },
//         ];

//         return (
//           <div
//             key={symbol.symbolName}
//             style={{
//               marginBottom: "40px",
//               padding: "15px",
//               border: "1px solid #ccc",
//               borderRadius: "8px",
//               background: "#f9f9f9",
//             }}
//           >
//             <h3>
//               {symbol.symbolName} — <small>{symbol.description}</small>
//             </h3>
//             <p>
//               <strong>Value:</strong> {symbol.stVal} &nbsp; | &nbsp;
//               <strong>Time:</strong> {new Date(symbol.t).toLocaleTimeString()}
//             </p>

//             <LineChart width={600} height={250} data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="time" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="value"
//                 stroke="#007bff"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             </LineChart>
//           </div>
//         );
//       })}
//     </div>
//   );

}

export default Symbols;
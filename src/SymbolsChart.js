import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchSymbolsRequest, fetchSymbolsSuccess, fetchSymbolsFailure} from "./Redux/Action";
import './selStyle.css';

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
    const symbolEndpoint = process.env.REACT_APP_API_SYMBOLS_URL;
    const userName = 'johnDoe';
    const password = 'pass123';
    const token = btoa(`${userName}:${password}`);
    const { symbols } = useSelector((state)=> state.symbols);
    const [symbolMetadata, setSymbolMetadata] = useState([]);
    const [liveSymbols, setLiveSymbols] = useState([]);

    // Fetch all symbols metadata
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
                symbolName: item.symbolName,
                description: item.description,
                type: item.type
            }));
            setSymbolMetadata(filteredSymbols);
        }
    },[symbols]);

    // Fetch real-time symbol values
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

     // Auto-refresh symbol values every 2 seconds
    useEffect(()=> {
        if(!symbolMetadata || symbolMetadata.Length ===0 ) return;
        fetchSymbolDetails();
        const interval = setInterval(()=> {
            fetchSymbolDetails();
        },2000)

        return(()=> clearInterval(interval))

    },[symbolMetadata]);

   //  Single clean return for UI + charts
    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>📈 Live Symbol Data</h1>

            {liveSymbols.length === 0 && <p>Loading symbols...</p>}

            {liveSymbols.map((symbol) => {
                // Chart expects array of objects [{ time, value }]
                const chartData = [
                {
                    time: new Date(symbol.t).toLocaleTimeString(),
                    value: symbol.stVal,
                },
                ];

                return (
                <div
                    key={symbol.symbolName}
                    style={{
                    marginBottom: "40px",
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    background: "#f9f9f9",
                    }}
                >
                    <h3>
                    {symbol.symbolName} — <small>{symbol.description}</small>
                    </h3>
                    <p>
                    <strong>Value:</strong> {symbol.stVal} &nbsp; | &nbsp;
                    <strong>Time:</strong> {new Date(symbol.t).toLocaleTimeString()}
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

}

export default Symbols;
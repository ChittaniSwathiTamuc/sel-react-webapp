import  {useEffect, useState, useMemo} from 'react';
import { useNavigate } from "react-router-dom";
import './selStyle.css';

const Symbols = () => {
    //const symbolEndpoint = process.env.REACT_APP_API_SYMBOLS_URL;
    const navigate = useNavigate();
    const symbolEndpoint = process.env.REACT_APP_API_SYMBOLS_SEL_URL;
    const userName = process.env.REACT_APP_USERNAME;
    const password = process.env.REACT_APP_PASSWORD;

    const token = btoa(`${userName}:${password}`);
    const [ symbols, setSymbols ] = useState([]);
    const [symbolMetadata, setSymbolMetadata] = useState([]);
    const [liveSymbols, setLiveSymbols] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "Name", direction: "asc" });
    const [error, setError] = useState(null);

    // Fetch all symbols metadata
    const fetchSymbolsData = async()=>{
        try{
            const response = await fetch(`${symbolEndpoint}?filter=SystemTags*&sort=asc`, {
                method: "GET",
                headers: {
                    "Authorization" : `Basic ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                }
            });

            if(!response.ok) {
                console.warn(`HTTP Error: ${response.status}`);
                setError(`Failed to load symbol list (status ${response.status})`);
                return;
            }

            const data = await response.json();
            setSymbols(data);
            console.log("swadata", data);
        }catch(error) {
            console.warn(`HTTP Error: ${error.message}`);
            setError(`Failed to load symbol list: ${error.message}`);
        };
    }

    useEffect(()=>{
        fetchSymbolsData();
    },[]);

    // Filter symbols (only type 'INS')
    useEffect(()=>{
        if(symbols && symbols.length >0 ) {
            const filteredSymbols = symbols.filter((symbol)=> symbol.Type === 'INS')
            .map((item)=>({
                Name: item.Name,
                Type: item.Type,
                Task: item.Task
            }));
            console.log("swafilterdSymbols:", filteredSymbols);
            setSymbolMetadata(filteredSymbols);
        }
    },[symbols]);

    //Parallel calls for all the symbols to get their details
    const fetchSymbolDetails = async() => {
      if(!symbolMetadata || symbolMetadata.length === 0 ) return;
      try {
        const fetchPromises = symbolMetadata.map((symbol)=>
          fetch(`${symbolEndpoint}/${symbol.Name}`, {
            method: "GET",
            headers: {
              "Authorization": `Basic ${token}`,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          }).then(async response => {
            if(!response.ok) return null;
            const data = await response.json();
            return {
              Name: symbol.Name,
              Type: symbol.type,
              stVal: data.stVal,
              t: data.t.value
            }
          }).catch(error => {
            console.warn(`⚠️ Skipped ${symbol.symbolName} — invalid json`);
          })
        )

        const results = await Promise.all(fetchPromises);
          setLiveSymbols(results.filter(Boolean));

      } catch(error) {
        setError(`Failed to load symbol details: ${error.message || error}`);
      }
    }

     // Auto-refresh symbol values every 2 seconds
    useEffect(()=> {
        if(!symbolMetadata || symbolMetadata.length ===0 ) return;
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

  const handleRetry = () => {
    setError(null);
    fetchSymbolsData();
  };

  // 🟢 Minimal UI
   return (
    <div className="container">
       <button 
        onClick={() => navigate("/SymbolsChart")}
        style={{ marginBottom: 20 }}
      >
        Go to Chart View
      </button>
      <h2>📋 Live Symbol Data</h2>

      {error && (
        <div style={{ marginBottom: 12, color: "red" }} role="alert">
          <strong>Error:</strong> {error}{" "}
          <button onClick={handleRetry} style={{ marginLeft: 8 }}>
            Retry
          </button>
        </div>
      )}

      {sorted.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table className="symbol-table">
          <thead>
            <tr>
              <th className="table-sno">SNo</th>
              <th onClick={() => handleSort("Name")}>
                Name {getSortArrow("Name")}
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
            {sorted.map((s, index) => (
              <tr key={s.Name}>
                <td>{index + 1}</td>
                <td>{s.Name}</td>
                <td>{s.stVal}</td>
                <td>{new Date(s.t).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

}

export default Symbols;
    import {useState, useEffect, useMemo} from 'react';
    import './selStyle.css';

    const SymbolsWithBearerAuth = () => {
        const username = process.env.REACT_APP_USERNAME;
        const password = process.env.REACT_APP_PASSWORD;
        const symbolEndpoint = process.env.REACT_APP_API_SYMBOLS_URL;
        const tokenEndpoint = process.env.REACT_APP_API_TOKEN_ENDPOINT;
        const [bearerToken, setBearerToken] = useState('');
        const [symbols, setSymbols] = useState([]);
        const [symbolsMetadata, setSymbolsMetadata] = useState([]);
        const [symbolsLiveData, setSymbolsLiveData] = useState([]);
        const [sortHeader, setSortHeader] = useState({key: "symbolName", direction: "asc"});

        const GetBearerToken = async() => {
            try {
                const TokenResponse = await fetch(tokenEndpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body : JSON.stringify({
                        "username": username,
                        "password": password
                    })
                });

                if(!TokenResponse.ok) return;

                const Token = await TokenResponse.json();

                setBearerToken(Token.jwtToken);
            
            }catch(error){
                throw new Error(`An error occurred while fetching token: ${error.message}`)
            }     
        };

        useEffect(()=>{
            GetBearerToken();
        },[]);

        const GetSymbols = async() =>{
            try{
                const SymbolResponse = await fetch(`${symbolEndpoint}?filter=SystemTags&sort=asc`, {
                method : "GET",
                    headers: {
                        "Authorization": `Bearer ${bearerToken}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    }
                });

                if(!SymbolResponse.ok) return;

                const symboldata = await SymbolResponse.json();
                setSymbols(symboldata);

            }catch(error){
                throw new Error (`unable to fetch the symbols data — ${error.message}`);
            }    

        }

        useEffect(()=>{
            if (!bearerToken) return;
            GetSymbols();
        },[bearerToken]);

        useEffect(()=>{
            if(symbols && symbols.length !==0 ) {
                const filteredList = symbols.filter((symbol)=> symbol.type === "INS")
                    .map((item)=> ({
                        symbolName : item.symbolName,
                        description: item.description,
                        type: item.type
                    }));
                
                setSymbolsMetadata(filteredList);
            }
        },[symbols]);

        const fetchSymbolsDetails = async() => {
            const updatedList = [];
            if(!symbolsMetadata || symbolsMetadata.length === 0) return;

            for(const symbol of symbolsMetadata){
                try {    
                    const symbolDetData = await fetch(`${symbolEndpoint}/${symbol.symbolName}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${bearerToken}`,
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }
                    });
                    if(!symbolDetData.ok) continue;
                    const detData = await symbolDetData.json();
                    updatedList.push({
                        symbolName: symbol.symbolName,
                        description: symbol.description,
                        type: symbol.type,
                        stVal: detData.stVal,
                        t: detData.t
                    })

                }catch(error) {
                    console.warn(`⚠️ Skipped ${symbol.symbolName}: — invalid json`);
                    continue;
                }      
            }
            setSymbolsLiveData(updatedList);
        };

        const handleSort= (key) => {
            const direction = sortHeader.key === key && sortHeader.direction === "asc" ? "desc" : "asc";
            setSortHeader({key, direction});
        }

        const getSortArrow = (key) => {
            return sortHeader.key === key ? (sortHeader.direction === "asc" ? "▲" : "▼") : "";
        }

        useEffect(()=>{
            if(symbolsMetadata.length === 0) return;
            fetchSymbolsDetails();
            const interval = setInterval(()=>{
                fetchSymbolsDetails();
            },2000);
            return (()=> clearInterval(interval)); 
        },[symbolsMetadata]);

        const storedSymbolData = useMemo(()=>{
            return[...symbolsLiveData].sort((a,b)=>{
                const aval = a[sortHeader.key];
                const bval = b[sortHeader.key];

                if(aval < bval) return sortHeader.direction === "asc" ? -1 : 1;
                if(aval > bval) return sortHeader.direction === "asc" ? 1 : -1;
                return 0;
            })
        },[sortHeader, symbolsLiveData]);

        return(
            <div className="container">
                <h2>📋 Live Symbol Data</h2>
                <table className="symbol-table">
                    <thead>
                        <tr>
                            <th onClick={()=> handleSort("symbolName")}>
                                Symbol Name {getSortArrow("symbolName")}
                            </th>
                            <th onClick={()=> handleSort("description")}>
                                description {getSortArrow("description")}
                            </th>
                            <th onClick={()=> handleSort("type")}>
                                Type {getSortArrow("type")}
                            </th>
                            <th onClick={()=> handleSort("stVal")}>
                                Value {getSortArrow("stVal")}
                            </th>
                            <th onClick={()=> handleSort("t")}>
                                Date & Time {getSortArrow("t")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {storedSymbolData.map((item)=>(
                            <tr key = {item.symbolName}>
                                <td>{item.symbolName}</td>
                                <td>{item.description}</td>
                                <td>{item.type}</td>
                                <td>{item.stVal}</td>
                                <td>{new Date(item.t).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )

    }

    export default SymbolsWithBearerAuth;
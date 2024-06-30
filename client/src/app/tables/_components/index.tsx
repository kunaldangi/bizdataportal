"use client";
import "./style.css";

import { CirclePlus, Search, Sheet, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

export function Tables({url}: {url: string}) {
    const [tablesList, setTablesList] = useState([]);

    useEffect(()=>{
        getTablesList(url);
    }, [])

    async function getTablesList(url: string) {
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query{
                        getTables{
                            id,
                            ownerId,
                            name
                        }
                    }
                `
            })
        });
    
        let data = await response.json();
        if(data.data.getTables){
            setTablesList(data.data.getTables);
        }
    }
    
    return (
        <div className="tables__main">
            <div className="tables__title"><Sheet width={32} height={32} />TABLES</div>
            <div className="tables__header">
                <div className="tables__header--search">
                    <Search width={20} height={20} />
                    <input type="text" placeholder="Search" />
                </div>
                <div className="tables__header--add" title="Add whitelist email" onClick={()=>{}}>
                    <CirclePlus width={26} height={26} />
                </div>
            </div>
            <div className="tables__content">
                <div><div className="tables__namesBox">
                    {tablesList.map((table: any, index: number) => {
                        return (<div className="tables__names" key={table.id} onContextMenu={(e)=>{console.log(" Context Menu Tables"); e.preventDefault();}}> <Sheet height={21} width={21} /> {table.name} <Trash2 className="tables__names--delete" height={25} width={25} onClick={(e)=>{e.preventDefault(); e.stopPropagation(); console.log("Delete");}} /></div>)
                    })}
                </div></div>
            </div>
        </div>
    );
}
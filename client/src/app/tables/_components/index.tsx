"use client";
import "./style.css";

import { CirclePlus, CircleX, Save, Search, Sheet, Trash2 } from "lucide-react";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useEffect, useState } from "react";

import { DropdownMenu } from "@/components/DropdownMenu";

export function Tables({url}: {url: string}) {
    const router = useRouter();
    const [tablesList, setTablesList] = useState([]);
    const [tableDropdown, setTableDropdown] = useState(null as any);

    useEffect(()=>{
        getTablesList(url);

        async function handleOnClick(e: any){
            if(e.target.className !== "tables__names") setTableDropdown(null);
            else{
                setTableDropdown({tableId: parseInt(e.target.id), clientX: e.clientX, clientY: e.clientY}); 
            }
        }
        document.addEventListener("click", handleOnClick);
        return () => { document.removeEventListener("click", handleOnClick);}
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

    function handleCreateTableClick() {
        let whitelistAddCard = document.getElementById("tables__createTable--id");
        whitelistAddCard?.classList.toggle("tables__createTable--show");
    }
    
    return (<>
        <div className="tables__main">
            <div className="tables__title"><Sheet width={32} height={32} />TABLES</div>
            <div className="tables__header">
                <div className="tables__header--search">
                    <Search width={20} height={20} />
                    <input type="text" placeholder="Search" />
                </div>
                <div className="tables__header--add" title="Add whitelist email" onClick={()=>{}}>
                    <CirclePlus width={26} height={26} onClick={handleCreateTableClick} />
                </div>
            </div>
            <div className="tables__content">
                <div><div className="tables__namesBox">
                    {tablesList.map((table: any) => {
                        return (<div className="tables__names" key={table.id} id={table.id} > <Sheet height={21} width={21} /> {table.name} <Trash2 className="tables__names--delete" height={25} width={25} onClick={(e)=>{}} /></div>)
                    })}
                </div></div>
            </div>
        </div>
        {
            tableDropdown && 
            <DropdownMenu className="tables__dropdown" X={tableDropdown.clientX} Y={tableDropdown.clientY}>
                <div className="tables__dropdown--item" onClick={()=>router.push(`/tables/${tableDropdown.tableId}/view`)}>View</div>
                <div className="tables__dropdown--item" onClick={()=>router.push(`/tables/${tableDropdown.tableId}/info`)}>Info</div>
                <div className="tables__dropdown--item" onClick={()=>router.push(`/tables/${tableDropdown.tableId}/users`)}>Users</div>
            </DropdownMenu>
        }

        <div className="tables__createTable" id="tables__createTable--id">
            <div className="tables__createTable--main">
                <div className="tables__createTable--close"><CircleX onClick={handleCreateTableClick} /></div>
                <div className="tables__createTable--logo"><Image src="/biz-logo.png" alt="logo" width={80} height={80} /></div>
                <div className="tables__createTable--title">Create a table</div>
                <input type="email" placeholder="Name" />
                <div className="tables__createTable--add" title="Add whitelist email" onClick={()=>{}}><Save width={26} height={26} /></div>
            </div>
        </div>
    </>);
}
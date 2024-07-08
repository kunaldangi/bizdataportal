"use client";
import "./style.css";

import { CirclePlus, CircleX, PlusSquare, Save, Search, Sheet, Trash2, X } from "lucide-react";

import { useRouter } from 'next/navigation';
import Image from "next/image";
import { useEffect, useState } from "react";

import { DropdownMenu } from "@/components/DropdownMenu";
import { ErrorBox } from "@/components/ErrorBox";
import { SuccessBox } from "@/components/SuccessBox";

export function Tables({url}: {url: string}) {
    const router = useRouter();
    const [tablesList, setTablesList] = useState([]);
    const [tableDropdown, setTableDropdown] = useState(null as any);
    const [fields, setFields] = useState([{title: "", dataType: "number", defaultValue: 0 as (string | number)}]);

    const [createSuccess, setCreateSuccess] = useState(null);
    const [createError, setCreateError] = useState(null);

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
    
    function removeField(index: number){
        if(fields.length > 1){
            let newFields = [...fields]; 
            setFields(newFields.slice(0, index).concat(newFields.slice(index+1)));
        }
    }

    function changeField(type: string, index: number, value: string){
        if(type === "title"){
            let newFields = [...fields];
            newFields[index].title = value;
            setFields(newFields);
        }
        if(type === "dataType"){
            let newFields = [...fields];
            newFields[index].dataType = value;
            if(newFields[index].dataType === "number"){
                if(isNaN(newFields[index].defaultValue as any)){
                    newFields[index].defaultValue = 0;
                }
            }
            setFields(newFields);
        }
        if(type === "defaultValue"){
            let newFields = [...fields];
            if(newFields[index].dataType === "number"){
                newFields[index].defaultValue = parseInt(value);
                if(isNaN(parseInt(value))) {
                    newFields[index].defaultValue = 0;
                }
            }
            else{
                newFields[index].defaultValue = value;
            }
            setFields(newFields);
        }
    }

    async function onTableCreate(){
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($name: String!, $fields: String){
                        createTable(name: $name, fields: $fields){
                            id
                            ownerId
                            name
                            fields{
                                id
                                title
                                dataType
                                defaultValue
                            }
                            totalFields
                        }
                    }
                `,
                variables: {
                    name: (document.getElementById("id_tables__createTable--name") as HTMLInputElement).value,
                    fields: JSON.stringify(fields)
                }
            })
        });

        let data = await response.json();
        if(data.errors){
            setCreateError(data.errors[0].message);
            return;
        }
        if(data.data.createTable){
            setCreateSuccess("Table created successfully!" as any);
            setTimeout(() => {
                router.push(`/tables/${data.data.createTable.id}/view`);
            }, 2000);
        }
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

                <input type="email" placeholder="Name" id="id_tables__createTable--name" />
                <div className="tables__createTable--fields">
                    <div className="createTable__fields">
                        <div className="createTable__fields--title">Fields</div>
                        {fields && fields.map((field, index) => {
                            return (<div className="tables__createTable--field">
                                <X width={18} height={18} onClick={()=>removeField(index)} />
                                <div className="createTable__field--title">
                                    <span>Title </span> <input type="text" name="" value={field.title} onChange={(e)=>{changeField("title", index, e.target.value)}} />
                                </div>
                                <div className="createTable__field--dataType">
                                    <span>Data Type </span>
                                    <select value={field.dataType} onChange={(e)=>{changeField("dataType", index, e.target.value)}}>
                                        <option value="number">Number</option>
                                        <option value="text">Text</option>
                                    </select>
                                </div>
                                <div className="createTable__field--defaultValue">
                                    <span>Default Value </span> <input type="text" name="" value={field.defaultValue} onChange={(e)=>{changeField("defaultValue", index, e.target.value)}} />
                                </div>
                            </div>);
                        })}
                    </div>
                </div>
                <div className="tables__createTable--addField" onClick={()=>{setFields([...fields, {title: "", dataType: "number", defaultValue: 0}])}}><PlusSquare width={24} height={24} /></div>
                {createError && <ErrorBox error={createError} closeError={()=>{setCreateError(null)}} />}
                {createSuccess && <SuccessBox success={createSuccess} closeSuccess={()=>{setCreateSuccess(null)}} />}
                <div className="tables__createTable--add" title="Add whitelist email" onClick={()=>{onTableCreate()}}><Save width={26} height={26} /></div>
            </div>
        </div>
    </>);
}
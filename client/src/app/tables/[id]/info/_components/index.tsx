"use client";
import "./style.css";

import { useEffect, useState } from "react";

import { ErrorToast } from "@/components/ErrorToast";
import { SuccessToast } from "@/components/SuccessToast";
import { Pencil, Save, Table, Trash2, X } from "lucide-react";

export function TableInfo({url, id}: {url: string, id: string}){
    const [tableInfo, setTableInfo] = useState({id: 0, ownerId: 0, name: "", description: "", totalFields: 0, fields: [] as any[]});

    const [edit, setEdit] = useState(false);

    const [tableError, setTableError] = useState(null);
    const [tableSuccess, setTableSuccess] = useState(null);

    useEffect(()=>{
        getTableInfo();
    }, []);

    async function getTableInfo(){
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query($id: ID!){
                        getTable(id: $id){
                            id,
                            ownerId,
                            name,
                            description,
                            totalFields,
                            fields{
                                id,
                                title,
                                dataType,
                                defaultValue
                            }
                        }
                    }
                `,
                variables: {
                    id: id
                }
            })
        });
        let data = await response.json();
        if(data.errors){
            setTableError(data.errors[0].message);
        }
        if(data.data.getTable){
            data = data.data.getTable;
            setTableSuccess("Loaded!" as any);
            setTableInfo(data);
        }
    }

    function removeField(index: number){
        if(tableInfo.fields.length > 1){
            let newFields = [...tableInfo.fields];
            newFields = newFields.slice(0, index).concat(newFields.slice(index+1));
            setTableInfo({...tableInfo, fields:  newFields});
        }
    }

    return (<>
        <div className="tableInfo__main">
            <div className="tableInfo__title"><Table />TABLE INFO</div>
            <div className="tableInfo__header">
                <div className="tableInfo__header--add" title="Add whitelist email" onClick={()=>{}}>
                    {edit ? <Save width={26} height={26} onClick={()=>{setEdit(false)}} /> : <Pencil width={25} height={25} onClick={()=>{setEdit(true)}} />}
                </div>
                <div className="tableInfo__header--delete" title="Add whitelist email" onClick={()=>{}}>
                    <Trash2 width={26} height={26} onClick={()=>{}} />
                </div>
            </div>

            <div className="tableInfo__content">

                <div className="tableInfo__content--field">
                    <div className="tableInfo__content--title">ID</div>
                    <input className="tableInfo__content--input" type="text" value={tableInfo.id} disabled />
                </div>
                <div className="tableInfo__content--field">
                    <div className="tableInfo__content--title">Owner ID</div>
                    <input className="tableInfo__content--input" type="text" value={tableInfo.id} disabled />
                </div>
                <div className="tableInfo__content--field">
                    <div className="tableInfo__content--title">Name</div>
                    <input className="tableInfo__content--input" type="text" value={tableInfo.name} onChange={(e)=>setTableInfo({...tableInfo, name: e.target.value})} disabled={!edit} />
                </div>
                <div className="tableInfo__content--field">
                    <div className="tableInfo__content--title">Description</div>
                    <textarea className="tableInfo__content--input" value={tableInfo.description} onChange={(e)=>setTableInfo({...tableInfo, description: e.target.value})} disabled={!edit} />
                </div>
                <div className="tableInfo__content--field">
                    <div className="tableInfo__content--title">Total Fields</div>
                    <input className="tableInfo__content--input" type="text" value={tableInfo.totalFields} onChange={(e)=>setTableInfo({...tableInfo, totalFields: parseInt(e.target.value)})} disabled />
                </div>

                <div className="tableInfo__content--fields">
                    <div className="tableInfo__fields">
                        <div className="tableInfo__fields--title">Fields</div>
                        <div className="tableInfo__fields--content">
                            { tableInfo.fields.map((field: any, index: number) => {
                                return (<div className="tableInfo__field">
                                    <X width={18} height={18} onClick={()=>removeField(index)} />
                                    <div className="tableInfo__field--title">
                                        <span>Title </span> <input type="text" value={field.title} onChange={(e)=>{}} disabled={!edit} />
                                    </div>
                                    <div className="tableInfo__field--dataType">
                                        <span>Data Type </span>
                                        <select value={field.dataType} onChange={(e)=>{}} disabled={!edit}>
                                            <option value="number">Number</option>
                                            <option value="text">Text</option>
                                        </select>
                                    </div>
                                    <div className="tableInfo__field--defaultValue">
                                        <span>Default Value </span> <input type="text" value={field.defaultValue} onChange={(e)=>{}} disabled={!edit} />
                                    </div>
                                </div>)
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {tableError && <ErrorToast error={tableError} closeError={()=>setTableError(null)} />}
        {tableSuccess && <SuccessToast success={tableSuccess} closeSuccess={()=>setTableSuccess(null)}/>}
    </>)
}
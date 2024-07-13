"use client";
import "./style.css";

import { Pencil, Sheet, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import { ErrorToast } from "@/components/ErrorToast";
import { SuccessToast } from "@/components/SuccessToast";


export function TableView({url, id}: {url: string, id: string}) {

    const [tableInfo, setTableInfo] = useState(null as any);
    const [tableData, setTableData] = useState(null as any);

    const [edit, setEdit] = useState(false);

    const [tableViewError, setTableViewError] = useState(null);
    const [tableViewSuccess, setTableViewSuccess] = useState(null);

    useEffect(()=>{
        readTableData();
    }, []);

    async function readTableData() {
        await getTableData();

        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query($id: ID!){
                        readTable(id: $id){
                            id
                            rows{
                                rowId
                                fieldId
                                title
                                value
                                createdat
                                updatedat
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
            setTableViewError(data.errors[0].message);
        }
        if(data.data.readTable){
            setTableData(data.data.readTable.rows);
            setTableViewSuccess("Table data loaded successfully!" as any);
        }
    }

    async function getTableData(){
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
            setTableViewError(data.errors[0].message);
        }

        if(data.data.getTable){
            setTableInfo(data.data.getTable);
            setTableViewSuccess("Table info loaded successfully!" as any);
        }
        
    }

    return (<>
        <div className="tableView__main">
            <div className="tableView__title"><Sheet />TABLE VIEW</div>
            <div className="tableView__header">
                <div className="tableUsers__header--edit">
                    {edit ? <> </> : <Pencil width={25} height={25} onClick={()=>{setEdit(true)}} />}
                </div>
                <div className="tableView__header--add" title="Add a user in table." onClick={()=>{}}>
                    <Trash2 width={26} height={26} onClick={()=>{}} />
                </div>
            </div>

            <div className="tableView__content">
                {tableInfo &&
                    <div className="table__container" style={{gridTemplateColumns: `repeat(${(tableInfo.totalFields+1)}, 1fr)`}}>
                        <div className="table__fields">ID</div>
                        { tableInfo.fields.map((field: any, index: number) => {
                            return (<div key={field.id} className="table__fields">{field.title}</div>)
                        }) }
                        
                        { tableData && 
                            tableData.map((row: any, index: number) => {
                                console.log(row);
                                let rows = [<div className="table__items">{row[0].rowId}</div>];
                                let newRows =  row.map((field: any, index: number) => {
                                    return (<div key={field.fieldId} className="table__items">{field.value}</div>)
                                })
                                rows = rows.concat(newRows);
                                return rows;
                            })
                        }
                    </div>
                }
            </div>
        </div>

        {tableViewError && <ErrorToast error={tableViewError} closeError={()=>setTableViewError(null)} />}
        {tableViewSuccess && <SuccessToast success={tableViewSuccess} closeSuccess={()=>setTableViewSuccess(null)}/>}
    </>)
}
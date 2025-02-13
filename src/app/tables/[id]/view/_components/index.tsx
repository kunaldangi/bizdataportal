"use client";
import "./style.css";

import XLSX from "xlsx";

import { FileDown, Pencil, Save, Sheet, SquarePlus, Trash2 } from "lucide-react";

import { useEffect, useState } from "react";

import { ErrorToast } from "@/components/ErrorToast";
import { SuccessToast } from "@/components/SuccessToast";


export function TableView({url, id}: {url: string, id: string}) {

    const [tableInfo, setTableInfo] = useState(null as any);
    const [tableData, setTableData] = useState(null as any);

    const [isAddRow, setIsAddRow] = useState(false);
    const [addRow, setAddRow] = useState(null as any);

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
            data.data.readTable.rows.reverse();
            setTableData(data.data.readTable.rows);
            setTableViewSuccess("Loaded!" as any);
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
            setTableViewSuccess("Loaded!" as any);
        }   
    }

    async function addNewRow(){
        let newRow = tableInfo.fields.map((field: any, index: number) => { 
            return {
                fieldId: field.id,
                value: field.defaultValue
            }
        });

        setAddRow(newRow);
        setIsAddRow(true);
    }

    async function saveAddRow(){

        let newRow: any = [];
        for(let i = 0; i < addRow.length; i++){
            if(tableInfo.fields[i].dataType === "number"){
                newRow.push({
                    fieldId: addRow[i].fieldId,
                    value: parseInt(addRow[i].value)
                })
            }
        }

        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($id: ID!, $rows: String!){
                        writeInTable(id: $id, rows: $rows){
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
                    id: id,
                    rows: JSON.stringify([newRow])
                }
            })
        });

        let data = await response.json();
        if(data.errors){
            console.log(data.errors);
            setTableViewError(data.errors[0].message);
        }
        if(data.data.writeInTable){
            if(!tableData){ setTableData([data.data.writeInTable.rows[0]]); }
            else{ setTableData([...tableData, data.data.writeInTable.rows[0]]); } // Because we are adding only one row at a time.
            setTableViewSuccess("Added!" as any);
            setAddRow(null);
            setIsAddRow(false);
        }
    }

    async function downloadTableAsSheet(){
        let fields = ["ID"];
        let newFields = tableInfo.fields.map((field: any) => field.title);
        fields = fields.concat(newFields);

        let rows = tableData.map((row: any) => {
            let fieldsObj: any = {};
            fieldsObj["ID"] = row[0].rowId;
            for(let i = 0; i < row.length; i++){
                fieldsObj[row[i].title] = row[i].value;
            }
            return fieldsObj;
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dates-UnderDevelopment");

        XLSX.utils.sheet_add_aoa(worksheet, [fields], { origin: "A1" });

        XLSX.writeFile(workbook, `${tableInfo.name}.xlsx`, { compression: true });
    }

    return (<>
        <div className="tableView__main">
            <div className="tableView__title"><Sheet />TABLE VIEW</div>
            <div className="tableView__header">
                <div className="tableUsers__header--edit">
                    {edit ? <> </> : <Pencil width={25} height={25} onClick={()=>{setEdit(true)}} />}
                </div>
                <div className="tableView__header--file" title="Download table as xlsx sheet."> 
                    <FileDown width={26} height={26} onClick={downloadTableAsSheet} />
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
                                let rows = [<div key={`id${(row[0].fieldId - 1)}`} className={"table__items table__items--id"} id={`id_tableRowID__${row[0].rowId}`}>{row[0].rowId}</div>];
                                let newRows =  row.map((field: any, index: number) => {
                                    return (<input key={`${field.fieldId + index}`} className="table__items" id={`id_cell__${field.rowId}${field.fieldId}`} value={field.value} disabled/>)
                                })
                                rows = rows.concat(newRows);
                                return rows;
                            })
                        }

                        {/* New added rows */}
                        { addRow && <div className={"table__items table__items--id"}> </div>}
                        {   addRow && addRow.map((row: any, index: number) => {
                                return (<input key={`addRow__${index}`} className="table__items table__items--addRow" id={`id_addRow__${row.fieldId}`} onChange={(e)=>{
                                    let newRow = addRow;
                                    newRow[index].value = e.target.value;
                                    setAddRow([...newRow]);
                                }} />)
                            })
                        }

                        { isAddRow ? <span className="table__add" onClick={saveAddRow}><Save /></span> : <span className="table__add" onClick={addNewRow}><SquarePlus /></span> }
                    </div>
                }
            </div>
        </div>

        {tableViewError && <ErrorToast error={tableViewError} closeError={()=>setTableViewError(null)} />}
        {tableViewSuccess && <SuccessToast success={tableViewSuccess} closeSuccess={()=>setTableViewSuccess(null)}/>}
    </>)
}
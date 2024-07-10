"use client";
import "./style.css";

import { CircleX, MailPlus, Pencil, Save, Trash2, UserPlus, Users } from "lucide-react";

import { useEffect, useState } from "react";

import { ErrorToast } from "@/components/ErrorToast";
import { SuccessToast } from "@/components/SuccessToast";
import { Switch } from "@/components/Switch";
import Image from "next/image";
import { ErrorBox } from "@/components/ErrorBox";
import { SuccessBox } from "@/components/SuccessBox";

export function TableUsers({url, id}: {url: string, id: string}){
    const [tableUsers, setTableUsers] = useState([] as any[]);

    const [edit, setEdit] = useState(false);

    const [addError, setAddError] = useState(null);
    const [addSuccess, setAddSuccess] = useState(null);

    const [tableUsersError, setTableUsersError] = useState(null);
    const [tableUsersSuccess, setTableUsersSuccess] = useState(null);

    useEffect(()=>{
        getTableUsers();
    }, [])

    async function getTableUsers(){
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query($tableId: ID!){
                        getTableUsers(tableId: $tableId){
                            id
                            username
                            email
                            permissions{
                                writeEntry
                                manageRows
                                manageFields
                                manageTable
                                manageUsers
                            }
                        }
                    }
                `,
                variables: {
                    tableId: id
                }
            })
        });

        let data = await response.json();
        if(data.errors){
            setTableUsersError(data.errors[0].message);
        }
        if(data.data.getTableUsers){
            data = data.data.getTableUsers;
            data = [...data]
            setTableUsersSuccess("Table users fetched successfully!" as any);
            setTableUsers(data);
            console.log(data);
        }
    }

    async function saveTableUsers(user: any, index: number){
        console.log(user.permissions);
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($tableId: ID!, $userId: ID!, $prm: String!){
                        editTableUserPermissions(tableId: $tableId, userId: $userId, permissions: $prm){
                            id
                            username
                            email
                            permissions{
                                writeEntry
                                manageRows
                                manageFields
                                manageTable
                                manageUsers
                            }
                        }
                    }
                `,
                variables: {
                    tableId: id,
                    userId: user.id,
                    prm: JSON.stringify(user.permissions)
                }
            })
        });
        let data = await response.json();
        if(data.errors){
            setTableUsersError(data.errors[0].message);
        }
        if(data.data.editTableUserPermissions){
            setTableUsersSuccess("Table user permissions saved successfully!" as any);
            data = data.data.editTableUserPermissions;
            let newTableUsers = tableUsers; 
            newTableUsers[index].permissions = data.permissions;
            setTableUsers([...newTableUsers]);
        }
        setEdit(false);
    }

    function handleAddUserClick() {
        let addUserCard = document.getElementById("tableUsers__addUserCard--id");
        addUserCard?.classList.toggle("tableUsers__addUserCard--show");
    }
    
    async function addUserInTable(){
        let userId = (document.querySelector(".tableUsers__addUserCard--main input") as HTMLInputElement).value;
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($tableId: ID!, $userId: ID!){
                        addTableUser(tableId: $tableId, userId: $userId){
                            id
                            username
                            email
                            permissions{
                                writeEntry
                                manageRows
                                manageFields
                                manageTable
                                manageUsers
                            }
                        }
                    }
                `,
                variables: {
                    tableId: id,
                    userId: userId
                }
            })
        });
        let data = await response.json();
        if(data.errors){
            setAddError(data.errors[0].message);
        }
        if(data.data.addTableUser){
            data = data.data.addTableUser;
            console.log(data);
            let newTableUsers = [...tableUsers, data];
            setTableUsers([...newTableUsers]);
            setAddSuccess("Table user added successfully!" as any);

            setTimeout(()=>{
                setAddSuccess(null);
            }, 2000);
        }
    }

    async function removeTableUser(userId: string, index: number){
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($tableId: ID!, $userId: ID!){
                        removeTableUser(tableId: $tableId, userId: $userId){
                            id
                            username
                        }
                    }
                `,
                variables: {
                    tableId: id,
                    userId: userId
                }
            })
        });
        let data = await response.json();
        if(data.errors){
            setTableUsersError(data.errors[0].message);
        }
        if(data.data.removeTableUser){
            data = data.data.removeTableUser;
            console.log(data);
            let newTableUsers = tableUsers;
            newTableUsers.splice(index, 1);
            setTableUsers([...newTableUsers]);
            setTableUsersSuccess("Table user removed successfully!" as any);
        }
    }

    return (<>
        <div className="tableUsers__main">
            <div className="tableUsers__title"><Users />TABLE USERS</div>
            <div className="tableUsers__header">
                <div className="tableUsers__header--edit">
                    {edit ? <> </> : <Pencil width={25} height={25} onClick={()=>{setEdit(true)}} />}
                </div>
                <div className="tableUsers__header--add" title="Add a user in table." onClick={()=>{}}>
                    <UserPlus width={26} height={26} onClick={handleAddUserClick} />
                </div>
            </div>

            <div className="tableUsers__content">
                <div className="tableUsers__users">
                    { tableUsers.map((user: any, index: number)=>{
                        console.log(index, user.username, user.permissions.writeEntry);
                        return (<div key={index} className="tableUsers__user">
                            <div className="user__actions"> 
                                {edit && <Save width={18} height={18} onClick={()=>{saveTableUsers(user, index)}} />}
                                <Trash2 width={18} height={18} onClick={()=>{removeTableUser(user.id, index)}} />
                            </div>
                            <div className="user__field">
                                <div className="user__title">ID</div>
                                <input className="user__input" type="text" value={user.id} disabled />
                            </div>
                            <div className="user__field">
                                <div className="user__title">Username</div>
                                <input className="user__input" type="text" value={user.username} disabled />
                            </div>
                            <div className="user__field">
                                <div className="user__title">Email</div>
                                <input className="user__input" type="text" value={user.email} disabled />
                            </div>
                            <div className="user__perm">
                                <div className="user__perm--title">Permissions</div>
                                <div className="user__perm--content">
                                    <div className="user__field">
                                        <div className="user__title">View Table</div>
                                        <Switch switchId="id__userPerm--viewTable" check={true} disabled={true} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e) => {}} />
                                    </div>
                                    <div className="user__field">
                                        <div className="user__title">Write Entry</div>
                                        <Switch switchId="id__userPerm--writeEntry" check={user.permissions.writeEntry} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e) => {
                                            let newTableUsers = tableUsers; newTableUsers[index].permissions.writeEntry = ((e.target as HTMLInputElement)?.checked); setTableUsers([...newTableUsers]);
                                        }} />
                                        {user.permissions.writeEntry ? "true" : "false"}
                                    </div>
                                    <div className="user__field">
                                        <div className="user__title">Manage Rows</div>
                                        <Switch switchId="id__userPerm--manageRows" check={user.permissions.manageRows} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e) => {
                                            let newTableUsers = tableUsers; newTableUsers[index].permissions.manageRows = ((e.target as HTMLInputElement)?.checked); setTableUsers([...newTableUsers]);
                                        }} />
                                    </div>
                                    <div className="user__field">
                                        <div className="user__title">Manage Fields</div>
                                        <Switch switchId="id__userPerm--manageFields" check={user.permissions.manageFields} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e) => {
                                            let newTableUsers = tableUsers; newTableUsers[index].permissions.manageFields = ((e.target as HTMLInputElement)?.checked); setTableUsers([...newTableUsers]);
                                        }} />
                                    </div>
                                    <div className="user__field">
                                        <div className="user__title">Manage Table</div>
                                        <Switch switchId="id__userPerm--manageTable" check={user.permissions.manageTable} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e) => {
                                            let newTableUsers = tableUsers; newTableUsers[index].permissions.manageTable = ((e.target as HTMLInputElement)?.checked); setTableUsers([...newTableUsers]);
                                        }} />
                                    </div>
                                    <div className="user__field">
                                        <div className="user__title">Manage Users</div>
                                        <Switch switchId="id__userPerm--manageUsers" check={user.permissions.manageUsers} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e) => {
                                            let newTableUsers = tableUsers; newTableUsers[index].permissions.manageUsers = ((e.target as HTMLInputElement)?.checked); setTableUsers([...newTableUsers]);
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>)
                    })}
                </div>
            </div>
        </div>

        <div className="tableUsers__addUserCard" id="tableUsers__addUserCard--id">
            <div className="tableUsers__addUserCard--main">
                <div className="tableUsers__addUserCard--close"><CircleX onClick={handleAddUserClick} /></div>
                <div className="tableUsers__addUserCard--logo"><Image src="/biz-logo.png" alt="logo" width={80} height={80} /></div>
                <div className="tableUsers__addUserCard--title">Add a user</div>
                <input type="number" placeholder="User ID" />
                {addError && <ErrorBox error={addError} closeError={()=>{setAddError(null)}} />}
                {addSuccess && <SuccessBox success={addSuccess} closeSuccess={()=>{setAddSuccess(null)}} />}
                <div className="tableUsers__addUserCard--add" title="Add whitelist email" onClick={addUserInTable}><MailPlus width={26} height={26} /></div>
            </div>
        </div>

        {tableUsersError && <ErrorToast error={tableUsersError} closeError={()=>setTableUsersError(null)} />}
        {tableUsersSuccess && <SuccessToast success={tableUsersSuccess} closeSuccess={()=>setTableUsersSuccess(null)}/>}
    </>)
}
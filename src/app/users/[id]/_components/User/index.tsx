"use client";
import "./style.css";

import { User as UserLogo, Save, Trash2, Pencil } from "lucide-react";

import { ChangeEvent, useState } from "react";
import { useEffect } from "react";
import { useRouter } from 'next/navigation';

import { Switch } from "@/components/Switch";
import { ErrorToast } from "@/components/ErrorToast";
import { SuccessToast } from "@/components/SuccessToast";

export function User({id}: {id: string}){
    const router = useRouter();

    const [userInfo, setUserInfo] = useState({id: "", username: "", email: "", level: "", permissions: {usersAcc: {manage: false, managePermissions: false, manageWhitelist: false}, tables: {create: false, read: false, writeIn: false, manage: false, manageUserPermissions: false}}});
    const [userInfoError, setUserInfoError] = useState([]);
    const [userInfoSuccess, setUserInfoSuccess] = useState(null as any);
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        getUser();
    }, []);

    async function getUser(){
        setEdit(false);
        let response = await fetch(`/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query($id: ID) {
                        getUser(id: $id){
                            id
                            username
                            email
                            level
                            createdAt
                            updatedAt
                            permissions{
                                usersAcc{
                                    manage, 
                                    managePermissions, 
                                    manageWhitelist  
                                }
                                tables{
                                    create
                                    read
                                    writeIn
                                    manage
                                    manageUserPermissions
                                }
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
            setUserInfoError(data.errors);
        }
        
        data = data.data.getUser;
        if(data){
            setUserInfo(data);
            setUserInfoSuccess("Loaded!");
        }
        setEdit(false);
    }

    async function updateUser(){
        setEdit(false);
        let cpUserInfo: any = {...userInfo};
        delete cpUserInfo?.id;
        delete cpUserInfo?.createdAt;
        delete cpUserInfo?.updatedAt;

        let response = await fetch(`/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($id: ID!, $user: String!){
                        updateUser(id: $id, userData: $user){
                            id
                            username
                            email
                            level
                            createdAt
                            updatedAt
                            permissions{
                                usersAcc{
                                    manage, 
                                    managePermissions, 
                                    manageWhitelist  
                                }
                                tables{
                                    create
                                    read
                                    writeIn
                                    manage
                                    manageUserPermissions
                                }
                            }
                        }
                    }
                `,
                variables: {
                    id: id,
                    user: JSON.stringify(cpUserInfo)
                }
            })
        });

        let data = await response.json();
        if(data.errors){
            setUserInfoError(data.errors);
        }

        data = data.data.updateUser;
        if(data){
            setUserInfo(data);
            setUserInfoSuccess("User data updated successfully!");
        }
    }

    async function deleteUser(){
        setEdit(false);
        let response = await fetch(`/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation($id: ID){
                        deleteUser(id: $id){
                            status
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
            setUserInfoError(data.errors);
        }

        console.log(data);
        data = data.data.deleteUser;
        if(data){
            setUserInfoSuccess("User deleted successfully!");
            setTimeout(() => {
                router.push("/users");
            }, 2000);
        }
    }

    return (<>
        <div className="user__main">
            <div className="user__title"><UserLogo width={32} height={32} /> USER PROFILE</div>
            <div className="user__header">
                <div className="user__header--add" title="Add whitelist email" onClick={()=>{}}>
                    {edit ? <Save width={26} height={26} onClick={()=>{updateUser()}} /> : <Pencil width={25} height={25} onClick={()=>{setEdit(true)}} />}
                </div>
                <div className="user__header--delete" title="Add whitelist email" onClick={()=>{}}>
                    <Trash2 width={26} height={26} onClick={()=>{deleteUser()}} />
                </div>
            </div>
            
            <div className="user__content">
                <div className="user__content--field">
                    <div className="user__content--title">ID</div>
                    <input className="user__content--input" type="text" value={userInfo.id} disabled />
                </div>
                <div className="user__content--field">
                    <div className="user__content--title">Username</div>
                    <input className="user__content--input" type="text" value={userInfo.username} onChange={(e)=>setUserInfo({...userInfo, username: e.target.value})} disabled={!edit} />
                </div>
                <div className="user__content--field">
                    <div className="user__content--title">Email</div>
                    <input className="user__content--input" type="text" value={userInfo.email} onChange={(e)=>setUserInfo({...userInfo, email: e.target.value})} disabled={!edit} />
                </div>
                <div className="user__content--field">
                    <div className="user__content--title">Level</div>
                    <input className="user__content--input" type="text" value={userInfo.level} onChange={(e)=>setUserInfo({...userInfo, level: e.target.value})} disabled={!edit} />
                </div>
                <div className="user__content--perm">

                    <div className="user__permUser">
                        <div className="user__permUser--title">User Account Permissions</div>

                        <div className="user__perm">
                            <div className="user__perm--title">Manage User Account</div>
                            <Switch switchId="id__permUser--manage" check={userInfo.permissions?.usersAcc?.manage} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.usersAcc.manage = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>

                        <div className="user__perm">
                            <div className="user__perm--title">Manage User Account Permissions</div>
                            <Switch switchId="id__permUser--managePermissions" check={userInfo.permissions?.usersAcc?.managePermissions} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.usersAcc.managePermissions = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>

                        <div className="user__perm">
                            <div className="user__perm--title">Manage Whitelist</div>
                            <Switch switchId="id__permUser--manageWhitelist" check={userInfo.permissions?.usersAcc?.manageWhitelist} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.usersAcc.manageWhitelist = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>
                    </div>

                    <div className="user__permTable">
                        <div className="user__permTable--title">Table Permissions</div>
                        
                        <div className="user__perm">
                            <div className="user__perm--title">Create Tables</div>
                            <Switch switchId="id_permTable--create" check={userInfo.permissions?.tables?.create} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.tables.create = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>

                        <div className="user__perm">
                            <div className="user__perm--title" id="">Read Tables</div>
                            <Switch switchId="id_permTable--read" check={userInfo.permissions?.tables?.read} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.tables.read = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>

                        <div className="user__perm">
                            <div className="user__perm--title" id="">Write In Tables</div>
                            <Switch switchId="id_permTable--writeIn" check={userInfo.permissions?.tables?.writeIn} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.tables.writeIn = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>

                        <div className="user__perm">
                            <div className="user__perm--title" id="">Manage Tables</div>
                            <Switch switchId="id_permTable--manage" check={userInfo.permissions?.tables?.manage} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.tables.manage = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>

                        <div className="user__perm">
                            <div className="user__perm--title" id="">Manage Tables User Permissions</div>
                            <Switch switchId="id_permTable--manageUserPermissions" check={userInfo.permissions?.tables?.manageUserPermissions} disabled={!edit} switchClass="user__perm--switch" sliderClass="user__perm--slider user__perm--round" onSwitchChange={(e: ChangeEvent) => {
                                let cpUserInfo = {...userInfo};
                                cpUserInfo.permissions.tables.manageUserPermissions = ((e.target as HTMLInputElement)?.checked);
                                setUserInfo(cpUserInfo);
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {
            ((userInfoError as any)?.at(-1)?.message) && <ErrorToast error={(userInfoError as any).at(-1).message} closeError={()=>{
                setUserInfoError([]);
                setTimeout(() => {
                    setUserInfoError([...userInfoError].slice(0, -1));
                }, 5500);
            }} />
        }

        { userInfoSuccess && <SuccessToast success={userInfoSuccess} closeSuccess={()=>{setUserInfoSuccess(null)}} /> }
    </>)
}
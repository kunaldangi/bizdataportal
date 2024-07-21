"use client";
import { ErrorToast } from "@/components/ErrorToast";
import "./style.css";

import { Search, User, Users as UsersLogo } from "lucide-react";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { SuccessToast } from "@/components/SuccessToast";

export function Users({url}: {url: string}){
    const router = useRouter();
    const[users, setUsers] = useState([]);

    const [usersError, setUsersError] = useState(null);
    const [usersSuccess, setUsersSuccess] = useState(null);

    useEffect(() => {
        getUsers();
    }, []);

    async function getUsers(){
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query{
                        getUsers{
                            id
                            username
                        }
                    }
                `
            })
        });

        let data = await response.json(); 
        if(data.errors){
            setUsersError(data.errors[0].message);
        }
        if(data.data.getUsers){
            data = data.data.getUsers;
            setUsers(data);
            setUsersSuccess("Loaded!" as any);
        }
        if(!data){
            setUsers([]);
        }
    }

    return (<>
        <div className="users__main">
            <div className="users__title"><UsersLogo width={32} height={32} /> USERS</div>
            <div className="users__header">
                <div className="users__header--search">
                    <Search width={20} height={20} />
                    <input type="text" placeholder="Search" />
                </div>
            </div>
            <div className="users__content">
                <div><div className="users__listBox">
                    {users.map((user: any, index: number) => {
                        return (<div className="users__item" key={user.id} onClick={()=>router.push(`/users/${user.id}`)}> <User /> {user.username}</div>)
                    })}
                </div></div>
            </div>
        </div>

        { usersError && <ErrorToast error={usersError} closeError={()=>{setUsersError(null)}} />}
        { usersSuccess && <SuccessToast success={usersSuccess} closeSuccess={()=>{setUsersSuccess(null)}} />}
    </>);
}
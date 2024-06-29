"use client";
import "./style.css";

import { Search, User, Users as UsersLogo } from "lucide-react";

import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export function Users({url}: {url: string}){
    const router = useRouter();
    const[users, setUsers] = useState([]);

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

        let data = await response.json(); data = data.data.getUsers;
        if(data){
            setUsers(data);
        }
        if(!data){
            setUsers([]);
        }
    }

    return (
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
    );
}
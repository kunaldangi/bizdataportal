"use client"
import "./style.css";

import { useEffect, useState } from "react";
import { Mail, MailPlus, Search, Trash2 } from "lucide-react";
import Image from "next/image";

export function Whitelist({url}: {url: string}) {
    const [whitelist, setWhitelist] = useState([]);

    useEffect(() => {
        getWhitelist(url);
    }, []);

    async function getWhitelist(url: string) {
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    query{
                        getWhitelistEmails{
                            id
                            email
                        }
                    }
                `
            })
        });
    
        let data = await response.json();
        if(data.data.getWhitelistEmails){
            setWhitelist(data.data.getWhitelistEmails);
        }
    }

    async function deleteWhitelistEmail(email: string) {
        console.log(email);
    }


    return (<>
        <div className="whitelist__addCard">
            <div className="whitelist__addCard--logo"><Image src="/biz-logo.png" alt="logo" width={80} height={80} /></div>
            <div className="whitelist__addCard--title">Add Whitelist Email</div>
            <input type="email" placeholder="Email" />
            <div className="whitelist__addCard--add" title="Add whitelist email"><MailPlus width={26} height={26} /></div>
        </div>

        <div className="whitelist__main">
            <div className="whitelist__title"><Mail width={32} height={32} /> WHITELIST EMAILS</div>
            <div className="whitelist__header">
                <div className="whitelist__header--search">
                    <Search width={20} height={20} />
                    <input type="text" placeholder="Search" />
                </div>
                <div className="whitelist__header--add" title="Add whitelist email">
                    <MailPlus width={26} height={26} />
                </div>
            </div>
            <div className="whitelist__content">
                <div><div className="whitelist__emailsBox">
                    {whitelist.map((email: any) => {
                        return (<div className="whitelist__emails" key={email.id}>{email.email} <Trash2 className="whitelist__emails--delete" height={30} width={30} onClick={()=>deleteWhitelistEmail(email.email)} /></div>)
                    })}
                </div></div>
            </div>
        </div>
    </>)
}
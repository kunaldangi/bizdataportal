"use client"
import "./style.css";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Mail, MailPlus, Search, Trash2, CircleX } from "lucide-react";

import { ErrorBox } from "@/components/ErrorBox";
import { SuccessBox } from "@/components/SuccessBox";
import { SuccessToast } from "@/components/SuccessToast";

export function Whitelist({url}: {url: string}) {
    const [whitelist, setWhitelist] = useState([]);

    const [addError, setAddError] = useState(null);
    const [addSuccess, setAddSuccess] = useState(null);

    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);

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

    async function deleteWhitelistEmail(email: string, index: number) {
        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation ($email: String){
                        deleteWhitelistEmail(email: $email){
                            status
                            message
                        }
                    }
                `,
                variables: {
                    email: email
                }
            })
        });

        let data = await response.json(); data = data.data.deleteWhitelistEmail;
        if(data.status === "error"){
            setAddError(data.message);
            return;
        }
        if(data.status === "ok"){
            let newWhitelist = whitelist;
            newWhitelist.splice(index, 1);
            setWhitelist([...newWhitelist] as any);
            setDeleteSuccess(data.message);
        }
    }

    function handleAddWhitelistClick() {
        let whitelistAddCard = document.getElementById("whitelist__addCard--id");
        whitelistAddCard?.classList.toggle("whitelist__addCard--show");
    }

    async function addWhitelistEmail() {
        let email = document.querySelector(".whitelist__addCard--main input") as HTMLInputElement;
        if(email.value === "") {
            setAddError("Email is required" as any);
            return;
        }

        let response = await fetch(`${url}/graphql`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                    mutation ($email: String!){
                        addWhitelistEmail(email: $email){
                            id
                            email
                        }
                    }
                `,
                variables: {
                    email: email.value
                }
            })
        });

        let data = await response.json();
        if(data.errors){
            setAddError(data.errors[0].message);
        }
        if(data?.data?.addWhitelistEmail){
            setAddSuccess("Email added successfully" as any);
            setWhitelist([...whitelist, data.data.addWhitelistEmail] as any);
            setTimeout(() => {
                setAddSuccess(null);
                handleAddWhitelistClick();
            }, 2000);
        }
    }


    return (<>
        <div className="whitelist__addCard" id="whitelist__addCard--id">
            <div className="whitelist__addCard--main">
                <div className="whitelist__addCard--close"><CircleX onClick={handleAddWhitelistClick} /></div>
                <div className="whitelist__addCard--logo"><Image src="/biz-logo.png" alt="logo" width={80} height={80} /></div>
                <div className="whitelist__addCard--title">Add Whitelist Email</div>
                <input type="email" placeholder="Email" />
                {addError && <ErrorBox error={addError} closeError={()=>{setAddError(null)}} />}
                {addSuccess && <SuccessBox success={addSuccess} closeSuccess={()=>{setAddSuccess(null)}} />}
                <div className="whitelist__addCard--add" title="Add whitelist email" onClick={addWhitelistEmail}><MailPlus width={26} height={26} /></div>
            </div>
        </div>

        <div className="whitelist__main">
            <div className="whitelist__title"><Mail width={32} height={32} /> WHITELIST EMAILS</div>
            <div className="whitelist__header">
                <div className="whitelist__header--search">
                    <Search width={20} height={20} />
                    <input type="text" placeholder="Search" />
                </div>
                <div className="whitelist__header--add" title="Add whitelist email" onClick={handleAddWhitelistClick}>
                    <MailPlus width={26} height={26} />
                </div>
            </div>
            <div className="whitelist__content">
                <div><div className="whitelist__emailsBox">
                    {whitelist.map((email: any, index: number) => {
                        return (<div className="whitelist__emails" key={email.id}>{email.email} <Trash2 className="whitelist__emails--delete" height={30} width={30} onClick={()=>deleteWhitelistEmail(email.email, index)} /></div>)
                    })}
                </div></div>
            </div>
        </div>

        { deleteSuccess && <SuccessToast success={deleteSuccess} closeSuccess={()=>{setDeleteSuccess(null)}} />}
    </>)
}
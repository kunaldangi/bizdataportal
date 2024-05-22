"use client";
import "./LoginButton.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from '@/components/Button';
import { ErrorBox } from "@/components/ErrorBox";
import { SuccessBox } from "@/components/SuccessBox";

export function LoginButton({url}: {url: string | undefined}) {
    const router = useRouter();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    async function login() {
        setError(null); setSuccess(null);
        const email = (document.getElementById('loginId__email') as HTMLInputElement).value;
        const pwd = (document.getElementById('loginId__pwd') as HTMLInputElement).value;

        let response = await fetch(`${url}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: pwd })
        });

        let data = await response.json();
        if(data.error) {
            setError(data.error);
        }
        if(data.success){
            setSuccess(data.success);
            setTimeout(() => {
                setSuccess(null);
                router.push('/');
            }, 2000);
        }
    }

    return(<>
        {error && <ErrorBox error={error} closeError={()=>{setError(null)}} />}
        {success && <SuccessBox success={success} closeSuccess={()=>{setSuccess(null)}} />}
        <Button className='login__btn' onClick={login}>Login</Button>
    </>);
}
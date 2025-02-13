"use client";
import "./LoginButton.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from '@/components/Button';
import { ErrorBox } from "@/components/ErrorBox";
import { SuccessBox } from "@/components/SuccessBox";

export function LoginButton({url, email, password}: {url: string | undefined, email: string | undefined, password: string | undefined}) {
    const router = useRouter();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [loginInfo, setLoginInfo] = useState({email: email, password: password});

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
        <input type="email" id="loginId__email" placeholder='Email' className='main__form--email' value={loginInfo.email} onChange={(e)=>setLoginInfo({email: e.target.value, password: loginInfo.password})} />
        <input type="password" id="loginId__pwd" placeholder='Password' className='main__form--password' value={loginInfo.password} onChange={(e)=>setLoginInfo({email: loginInfo.email, password: e.target.value})} />
        {error && <ErrorBox error={error} closeError={()=>{setError(null)}} />}
        {success && <SuccessBox success={success} closeSuccess={()=>{setSuccess(null)}} />}
        <Button className='login__btn' onClick={login}>Login</Button>
    </>);
}
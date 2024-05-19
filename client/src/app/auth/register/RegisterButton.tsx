"use client"
import "./RegisterButton.css";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from '@/components/Button';
import { ErrorBox } from "@/components/ErrorBox";
import { SuccessBox } from "@/components/SuccessBox";

export function RegisterForm({url}: {url: string | undefined}) {
    const router = useRouter();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [otp, setOtp] = useState(false);

    async function register() {
        setError(null); setSuccess(null);
        const usrname = (document.getElementById('registerId__usrname') as HTMLInputElement).value;
        const email = (document.getElementById('registerId__email') as HTMLInputElement).value;
        const pwd = (document.getElementById('registerId__pwd') as HTMLInputElement).value;

        let response = await fetch(`${url}/api/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: usrname, email: email, password: pwd })
        });

        let data = await response.json();
        if(data.error) {
            setError(data.error);
        }
        if(data.success){
            setSuccess(data.success);
            setOtp(true);
        }
    }

    async function verifyOtp() {
        setError(null); setSuccess(null);
        const otp = (document.getElementById('registerId__otp') as HTMLInputElement).value;

        let response = await fetch(`${url}/api/auth/verify`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: otp })
        });

        let data = await response.json();
        console.log(data);
        if(data.error){
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
        <div className="main__title">Create Your Account</div>
        <div className="main__form">
            {
                otp ? 
                    // OTP Field
                    <>
                        <input type="number" id="registerId__otp" placeholder="OTP" />
                    </>
                :
                    // Register Fields
                    <>
                        <input type="text" id="registerId__usrname" placeholder='Username' className='main__form--usrname' />
                        <input type="email" id="registerId__email" placeholder='Email' className='main__form--email' />
                        <input type="password" id="registerId__pwd" placeholder='Password' className='main__form--password' />
                    </>
            }

            {error && <ErrorBox error={error} closeError={()=>{setError(null)}} />}
            {success && <SuccessBox success={success} closeSuccess={()=>{setSuccess(null)}} />}
            <Button className='register__btn' onClick={()=>{if(otp) verifyOtp(); else register();}}> {otp ? <>Verify</> : <>Register</> }</Button>
        </div>
    </>);
}
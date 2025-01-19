"use client";
import "./GotoLogin.css";

import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";

export function GotoLogin() {
    const router = useRouter();
    return (<Button className='gotoLogin_btn' onClick={()=>{router.push('/auth/login')}}>Login</Button>);
}
"use client";
import "./GotoRegister.css";

import { useRouter } from "next/navigation";

import { Button } from "@/components/Button";

export function GotoRegister() {
    const router = useRouter();
    return (<Button className='gotoRegister_btn' onClick={()=>{router.push('/auth/register')}}>Register</Button>);
}
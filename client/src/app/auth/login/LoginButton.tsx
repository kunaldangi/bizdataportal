"use client";
import "./LoginButton.css";

import { Button } from '@/components/Button';

export function LoginButton() {
    return(<Button className='login__btn' onClick={()=>{console.log("Hello World!")}}>Login</Button>);
}
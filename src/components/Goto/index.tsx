"use client";

import { useRouter } from 'next/navigation';

export function Goto({children, href}: {children: React.ReactNode, href: string}){
    const router = useRouter();
    return(<span onClick={()=>{router.push(href)}}>{children}</span>)
}
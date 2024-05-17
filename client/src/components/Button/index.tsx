"use client";

import "./style.css";

export function Button({children, className, onClick, ...props}: {children: React.ReactNode, className: string, onClick: ()=>any, }) {
    return (<button className={className} {...props}>{children}</button>);
}
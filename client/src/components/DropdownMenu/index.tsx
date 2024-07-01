import React, { CSSProperties } from "react";

export function DropdownMenu({children, className, X, Y}: {children: React.ReactNode, className: string, X: number, Y: number}){
    
    let style: CSSProperties = {
        position: "absolute",
        left: `${X}px`,
        top: `${Y}px`
    }

    return (<>
        <div className={className} style={style}>
            {children}
        </div>
    </>)
}
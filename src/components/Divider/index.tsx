import "./style.css";

export function DividerLine({children, boxClass, lineClass}: {children: React.ReactNode, boxClass: string, lineClass: string}){
    return (<div className={`compDivider_dividerBox ${boxClass}`}>
        <div className={`compDivider_dividerLine ${lineClass}`}></div>
        {children}
        <div className={`compDivider_dividerLine ${lineClass}`}></div>
    </div>)
}
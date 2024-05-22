import "./style.css";

export function Content({ children}: { children: React.ReactNode}){
    return (
        <div className="home__content">
            {children}
        </div>
    );
}
import "./style.css";

export function Body({ children }: { children: React.ReactNode}) {
    return (
        <div className="home__body">
            {children}
        </div>
    )
}
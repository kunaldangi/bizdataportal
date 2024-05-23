import "./style.css";

export function IndexBar({ children }: { children: React.ReactNode}) {
    return (<>
        <div className="home__indexbar">
            {children}
        </div>
    </>);
}
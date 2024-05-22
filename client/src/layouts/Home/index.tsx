import { Navbar } from "./Navbar";
import "./style.css";

export function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="home__main">
            <Navbar /> {/* We are directly using Navbar components because it's static to every pages.*/}
            {children}
        </div>
    );
}
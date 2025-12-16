import ThemeToggle from "../components/ThemeToggle";
import {User} from "lucide-react";

export default function Topbar({pageTitle="Dashboard"}){
    return(
        <header
        className="border-b px-8 py-4 flex items-center justify-between"
        style={{
            backgroundColor:"var(--bg-card)",
            borderColor:"var(--border-subtle)",
        }}>
            {/**Page title*/}
            <h1
            className="text-2xl font-bold"
            style={{color:"var(--text-primary"}}>
                {pageTitle}
            </h1>
            {/**Right section Theme toggle+ User avatar*/}
            <div
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            style={{
                background:"var(--gradient-bg)",
                border:"2px solid var(--border-subtle)",
            }}>
                <User
                className="w-5 h-5"
                style={{color:"var(--accent-purple)"}}></User>
            </div>
        </header>
    );
}
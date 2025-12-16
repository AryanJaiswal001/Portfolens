import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function PrivateLayout({children,pageTitle})
{
    return(
        <div
        className="flex h-screen overflow-hidden"
        style={{backgroundColor:"var(--bg-app"}}
        >
            {/**Sidebar-Fixed width*/}
            <Sidebar/>

            {/**Main content area-Flexible*/}
            <div
            className="flex-1 flex flex-col overflow-hidden">
                {/**Topbar*/}
                <Topbar pageTitle={pageTitle}/>

                {/**Scrollable content*/}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
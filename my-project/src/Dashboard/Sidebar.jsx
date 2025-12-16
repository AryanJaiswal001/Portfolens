import {Link ,useLocation} from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    TrendingUp,
    FileText,
    Settings,
} from 'lucide-react';
import Logo from '../components/Logo';

const navItems=[
    {path:"/dashboard",label:"Dashboard",icon:LayoutDashboard},
    {path:"/portfolio",label:"Portfolio",icon:Briefcase},
    {path:"/insights",label:"Insights",icon:TrendingUp},
    {path:"/reports",label:"Reports",icon:FileText},
    {path:"/settings",label:"Settings",icon:Settings},
];

export default function Sidebar(){
    const location=useLocation();

    return (
      <aside
        className="w-64 border-r flex flex-col"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {/**Logo section*/}
        <div
          className="p-6 border-b"
          style={{
            borderColor: "var(--border-subtle)",
          }}
        >
          <div className="flex items-center space-x-3">
            <Logo className="w-10 h-10" />
            <span
              className="text-xl font-bold"
              style={{
                background: "var(--gradient-text)",
                WebkitBackdropClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              PortfoLens
            </span>
          </div>
        </div>

        {/**Navigation*/}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? "var(--bg-app)"
                        : "transparent",
                      color: isActive
                        ? "var(--accent-purple)"
                        : "var(--text-secondary)",
                      fontWeight: isActive ? "600" : "500",
                      border: isActive
                        ? "1px solid var(--border-medium)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "var(--bg-app)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <Icon className="w-5 h-5"></Icon>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Footer / Version */}
        <div
          className="p-4 border-t"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-tertiary)" }}
          >
            v1.0.0 · PortfoLens
          </p>
        </div>
      </aside>
    );
}
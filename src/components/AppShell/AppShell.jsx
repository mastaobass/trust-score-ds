import TopBar from "../TopBar/TopBar";
import Sidebar from "../Sidebar/Sidebar";
import "./AppShell.css";

/** Full-width TopBar + Sidebar rail + main content. */
export default function AppShell({
  email = "email@example.com",
  org = "Bancolombia",
  activeNavId = "case-management",
  children,
  ...rest
}) {
  return (
    <div className="ts-app-shell" {...rest}>
      <TopBar email={email} org={org} />
      <div className="ts-app-shell__body">
        <Sidebar activeId={activeNavId} />
        <main className="ts-app-shell__main">{children}</main>
      </div>
    </div>
  );
}

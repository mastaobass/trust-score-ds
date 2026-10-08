import TopBar from "../TopBar/TopBar";
import Sidebar from "../Sidebar/Sidebar";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import "./AppShell.css";

/** Full-width TopBar + Sidebar rail + breadcrumb above main content. */
export default function AppShell({
  email = "email@example.com",
  org = "Bancolombia",
  activeNavId = "case-management",
  breadcrumbs = [],
  children,
  ...rest
}) {
  return (
    <div className="ts-app-shell" {...rest}>
      <TopBar email={email} org={org} />
      <div className="ts-app-shell__body">
        <Sidebar activeId={activeNavId} />
        <main className="ts-app-shell__main">
          {breadcrumbs.length > 0 ? <Breadcrumb items={breadcrumbs} /> : null}
          {children}
        </main>
      </div>
    </div>
  );
}

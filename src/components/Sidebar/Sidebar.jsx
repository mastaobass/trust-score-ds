import gridIcon from "./assets/grid.svg";
import fileTextIcon from "./assets/file-text.svg";
import shieldIcon from "./assets/shield.svg";
import clipboardIcon from "./assets/clipboard.svg";
import buildingIcon from "./assets/building-2.svg";
import usersIcon from "./assets/users.svg";
import clockIcon from "./assets/clock.svg";
import "./Sidebar.css";

const SIDEBAR_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: gridIcon },
  { id: "case-management", label: "Case Management", icon: fileTextIcon },
  {
    id: "policy",
    label: "Policy",
    icons: [shieldIcon, clipboardIcon],
  },
  { id: "organization", label: "Organization", icon: buildingIcon },
  { id: "team", label: "Team", icon: usersIcon },
  { id: "audit-log", label: "Audit Log", icon: clockIcon },
];

/** 80px icon rail. Non-active items are non-navigating until routes exist. */
export default function Sidebar({
  activeId = "case-management",
  items = SIDEBAR_ITEMS,
  ...rest
}) {
  return (
    <nav className="ts-sidebar" aria-label="Console" {...rest}>
      <ul className="ts-sidebar__list">
        {items.map((item) => {
          const active = item.id === activeId;
          const iconSrcs = item.icons ?? (item.icon ? [item.icon] : []);
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`ts-sidebar__item${active ? " ts-sidebar__item--active" : ""}`}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                aria-disabled={active ? undefined : true}
                tabIndex={active ? 0 : -1}
              >
                <span
                  className={`ts-sidebar__icons${iconSrcs.length > 1 ? " ts-sidebar__icons--stack" : ""}`}
                >
                  {iconSrcs.map((src, i) => (
                    <img
                      key={`${item.id}-${i}`}
                      className="ts-sidebar__icon"
                      src={src}
                      alt=""
                      width={24}
                      height={24}
                    />
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

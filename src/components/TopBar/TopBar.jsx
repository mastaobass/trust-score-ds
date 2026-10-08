import "./TopBar.css";

/** App chrome brand + account strip. Chevrons are static affordances (no menus yet). */
export default function TopBar({
  email = "email@example.com",
  org = "Bancolombia",
  ...rest
}) {
  return (
    <header className="ts-topbar" {...rest}>
      <div className="ts-topbar__brand" aria-label="EQUIFAX Kount 360">
        <span className="ts-topbar__equifax">EQUIFAX</span>
        <span className="ts-topbar__pipe" aria-hidden="true">
          |
        </span>
        <span className="ts-topbar__product">Kount® 360</span>
      </div>
      <div className="ts-topbar__account">
        <span className="ts-topbar__email">
          {email}
          <span className="ts-topbar__chevron" aria-hidden="true">
            ▾
          </span>
        </span>
        <span className="ts-topbar__org">
          {org}
          <span className="ts-topbar__chevron" aria-hidden="true">
            ▾
          </span>
        </span>
      </div>
    </header>
  );
}

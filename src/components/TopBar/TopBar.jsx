import searchIcon from "./assets/search.svg";
import bellIcon from "./assets/bell.svg";
import userIcon from "./assets/user.svg";
import "./TopBar.css";

/** Brand strip plus decorative account tools. Controls do not navigate yet. */
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
        <label className="ts-topbar__search">
          <img src={searchIcon} alt="" width={16} height={16} />
          <input type="search" placeholder="Search" aria-label="Search" readOnly />
        </label>
        <button type="button" className="ts-topbar__icon-btn" aria-label="Notifications">
          <img src={bellIcon} alt="" width={18} height={18} />
        </button>
        <button type="button" className="ts-topbar__icon-btn" aria-label="User">
          <img src={userIcon} alt="" width={18} height={18} />
        </button>
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

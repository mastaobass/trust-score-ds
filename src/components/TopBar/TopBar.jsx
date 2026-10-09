import { useEffect, useId, useRef, useState } from "react";
import searchIcon from "./assets/search.svg";
import bellIcon from "./assets/bell.svg";
import userIcon from "./assets/user.svg";
import { getTheme, setTheme, subscribeTheme } from "../../lib/theme";
import "./TopBar.css";

const DEFAULT_BANKS = ["Bancolombia", "Northwind Bank", "Harbor Credit"];
const APPEARANCE = ["system", "light", "dark"];
const THEME_LABEL = { system: "System", light: "Light", dark: "Dark" };

function ThemeIcon({ name }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  };
  if (name === "system") {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 20h8M12 16v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "light") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path
        d="M21 14.5A8.5 8.5 0 1 1 9.5 3a7 7 0 0 0 11.5 11.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Brand strip. Search and the bell are decorative. Bank and user menus open locally. */
export default function TopBar({
  email = "email@example.com",
  org = "Bancolombia",
  banks = DEFAULT_BANKS,
  ...rest
}) {
  const [open, setOpen] = useState(null);
  const [bank, setBank] = useState(org);
  const [theme, setThemeState] = useState(getTheme);
  const rootRef = useRef(null);
  const bankMenuId = useId();
  const userMenuId = useId();
  const appearanceId = useId();
  const bankOptions = banks.includes(org) ? banks : [org, ...banks];

  useEffect(() => {
    setBank(org);
  }, [org]);

  useEffect(() => subscribeTheme((next) => setThemeState(next)), []);

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(null);
    }
    function onKeyDown(event) {
      if (event.key === "Escape") setOpen(null);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function toggle(menu) {
    setOpen((current) => (current === menu ? null : menu));
  }

  function chooseTheme(next) {
    setTheme(next);
    setThemeState(next);
  }

  function onThemeKey(event) {
    const index = APPEARANCE.indexOf(theme);
    const current = index === -1 ? 0 : index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      chooseTheme(APPEARANCE[(current + 1) % APPEARANCE.length]);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      chooseTheme(APPEARANCE[(current + APPEARANCE.length - 1) % APPEARANCE.length]);
    }
  }

  return (
    <header className="ts-topbar" {...rest} ref={rootRef}>
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
        <div className="ts-topbar__menu">
          <button
            type="button"
            className="ts-topbar__menu-btn ts-topbar__bank"
            aria-haspopup="listbox"
            aria-expanded={open === "bank"}
            aria-controls={bankMenuId}
            onClick={() => toggle("bank")}
          >
            {bank}
            <span className="ts-topbar__chevron" aria-hidden="true">
              ▾
            </span>
          </button>
          {open === "bank" ? (
            <ul id={bankMenuId} className="ts-topbar__menu-list" role="listbox" aria-label="Banks">
              {bankOptions.map((name) => (
                <li key={name}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={name === bank}
                    onClick={() => {
                      setBank(name);
                      setOpen(null);
                    }}
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="ts-topbar__menu">
          <button
            type="button"
            className="ts-topbar__menu-btn ts-topbar__user"
            aria-haspopup="menu"
            aria-expanded={open === "user"}
            aria-controls={userMenuId}
            onClick={() => toggle("user")}
          >
            <img src={userIcon} alt="" width={18} height={18} />
            <span>{email}</span>
            <span className="ts-topbar__chevron" aria-hidden="true">
              ▾
            </span>
          </button>
          {open === "user" ? (
            <ul id={userMenuId} className="ts-topbar__menu-list" role="menu" aria-label="Account">
              <li>
                <button type="button" role="menuitem" onClick={() => setOpen(null)}>
                  Profile
                </button>
              </li>
              <li>
                <button type="button" role="menuitem" onClick={() => setOpen(null)}>
                  Sign out
                </button>
              </li>
              <li className="ts-topbar__appearance">
                <div className="ts-topbar__appearance-label" id={appearanceId}>
                  Appearance
                </div>
                <div
                  className="ts-topbar__theme"
                  role="radiogroup"
                  aria-labelledby={appearanceId}
                  onKeyDown={onThemeKey}
                >
                  {APPEARANCE.map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={theme === value}
                      tabIndex={theme === value ? 0 : -1}
                      onClick={() => chooseTheme(value)}
                    >
                      <ThemeIcon name={value} />
                      <span>{THEME_LABEL[value]}</span>
                    </button>
                  ))}
                </div>
              </li>
            </ul>
          ) : null}
        </div>
      </div>
    </header>
  );
}

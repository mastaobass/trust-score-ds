import { useEffect, useId, useRef, useState } from "react";
import searchIcon from "./assets/search.svg";
import bellIcon from "./assets/bell.svg";
import userIcon from "./assets/user.svg";
import { getTheme, setTheme, subscribeTheme, THEMES } from "../../lib/theme";
import "./TopBar.css";

const DEFAULT_BANKS = ["Bancolombia", "Northwind Bank", "Harbor Credit"];
const THEME_LABEL = { light: "Light", dark: "Dark", system: "System" };

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
    const index = THEMES.indexOf(theme);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      chooseTheme(THEMES[(index + 1) % THEMES.length]);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      chooseTheme(THEMES[(index + THEMES.length - 1) % THEMES.length]);
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
                  {THEMES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={theme === value}
                      tabIndex={theme === value ? 0 : -1}
                      onClick={() => chooseTheme(value)}
                    >
                      {THEME_LABEL[value]}
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

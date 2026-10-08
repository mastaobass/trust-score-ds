import "./Breadcrumb.css";

/** Muted trail. Last segment is current page text, never a competing heading. */
export default function Breadcrumb({ items = [], ...rest }) {
  return (
    <nav className="ts-breadcrumb" aria-label="Breadcrumb" {...rest}>
      <ol className="ts-breadcrumb__list">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          const linked = Boolean(item.href) && !last;
          return (
            <li key={`${item.label}-${index}`} className="ts-breadcrumb__item">
              {index > 0 ? (
                <span className="ts-breadcrumb__sep" aria-hidden="true">
                  ›
                </span>
              ) : null}
              {linked ? (
                <a className="ts-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

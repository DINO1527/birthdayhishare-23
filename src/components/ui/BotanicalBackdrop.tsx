export function BotanicalBackdrop() {
  return <div className="botanical-backdrop" aria-hidden="true">
    <div className="garden-light" />
    <div className="garden-shadow" />
    <div className="opening-atmosphere"><span /><span /><span /></div>
    <div className="opening-florals">
      {Array.from({ length: 8 }, (_, index) => <span className={`opening-floral ${index % 3 === 0 ? "is-flower" : "is-leaf"}`} key={index}>
        {index % 3 === 0 ? <svg viewBox="0 0 100 100" fill="none"><g fill="#f8e8df" stroke="#e9cfc5" strokeWidth="1.5">{Array.from({ length: 5 }, (_, petal) => <ellipse key={petal} cx="50" cy="26" rx="13" ry="24" transform={`rotate(${petal * 72} 50 50)`} />)}</g><circle cx="50" cy="50" r="12" fill="#c9a37d" /></svg>
          : <svg viewBox="0 0 100 100" fill="none"><path d="M17 78C18 35 58 12 83 19c4 37-23 63-66 59Z" fill="#b7bca6" /><path d="M17 78c20-23 41-41 66-59" stroke="#829178" strokeWidth="1.5" /></svg>}
      </span>)}
    </div>
  </div>;
}

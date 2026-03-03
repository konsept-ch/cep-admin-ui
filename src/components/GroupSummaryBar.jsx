export const GroupSummaryBar = ({ items = [] }) => {
    if (items.length === 0) return null

    return (
        <div className="group-summary-bar">
            <span className="group-summary-title">Groupes:</span>
            {items.map(({ text, tooltip }, index) => (
                <span className="group-summary-item" key={`${text}-${index}`} title={tooltip ?? text}>
                    <span className="group-summary-item-value">{text}</span>
                    {index < items.length - 1 && <span className="group-summary-separator">/</span>}
                </span>
            ))}
        </div>
    )
}

interface Props {
  icon?: React.ReactNode
  title: string
  children?: React.ReactNode
  action?: React.ReactNode
}

export default function EmptyState({ icon, title, children, action }: Props) {
  return (
    <div className="panel-empty-state">
      {icon && <span className="panel-empty-icon" aria-hidden="true">{icon}</span>}
      <p className="panel-empty-title">{title}</p>
      {children && <div className="panel-empty-desc">{children}</div>}
      {action}
    </div>
  )
}

import { cn } from '@/lib/cn';
import styles from './StatCard.module.css';

/**
 * StatCard — Metric display for profiles and dashboards.
 */
export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  className = '',
  onClick,
  ...props
}) {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        styles.card,
        onClick && styles.clickable,
        className
      )}
      {...props}
    >
      <div className={styles.layout}>
        <div className={styles.content}>
          <p className={styles.label}>
            {label}
          </p>
          <p className={styles.value}>{value}</p>
          {trendLabel && (
            <p className={styles.trendLabel}>{trendLabel}</p>
          )}
        </div>
        {icon && (
          <div className={styles.icon}>
            {icon}
          </div>
        )}
      </div>
        <div className={styles.trend}>{trend}</div>
    </Component>
  );
}

/**
 * StatCardGroup — Grid layout for multiple stats.
 */
export function StatCardGroup({ children, className = '', columns = 3, ...props }) {
  const colClass = {
    2: styles.col2,
    3: styles.col3,
    4: styles.col4,
  }[columns] ?? styles.col3;

  return (
    <div
      className={cn(styles.group, colClass, className)}
      {...props}
    >
      {children}
    </div>
  );
}

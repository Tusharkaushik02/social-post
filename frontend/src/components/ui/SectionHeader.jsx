import { cn } from '@/lib/cn';
import styles from './SectionHeader.module.css';

/**
 * SectionHeader — Page or section title row with optional action.
 */
export default function SectionHeader({
  title,
  subtitle,
  action,
  badge,
  className = '',
  titleClassName = '',
  ...props
}) {
  return (
    <div
      className={cn(styles.container, className)}
      {...props}
    >
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h2 className={cn(styles.title, titleClassName)}>
            {title}
          </h2>
          {badge}
        </div>
        {subtitle && (
          <p className={styles.subtitle}>{subtitle}</p>
        )}
      </div>
      {action && (
        <div className={styles.action}>{action}</div>
      )}
    </div>
  );
}

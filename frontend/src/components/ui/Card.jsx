import { cn } from '@/lib/cn';
import styles from './Card.module.css';

const paddingStyles = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
};

/**
 * Card — Rounded surface container with soft shadow.
 *
 * @param {'none'|'sm'|'md'|'lg'} padding
 * @param {boolean} hoverable - Subtle lift on hover
 * @param {boolean} bordered - Show border
 */
export default function Card({
  children,
  className = '',
  padding = 'md',
  hoverable = false,
  bordered = true,
  as: Component = 'div',
  ...props
}) {
  return (
    <Component
      className={cn(
        styles.card,
        bordered && styles.bordered,
        paddingStyles[padding] ?? paddingStyles.md,
        hoverable && styles.hoverable,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * CardHeader — Title area inside a Card.
 */
export function CardHeader({ children, className = '', ...props }) {
  return (
    <div
      className={cn(styles.header, className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * CardTitle — Primary heading inside a Card.
 */
export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3
      className={cn(styles.title, className)}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * CardDescription — Secondary text inside a Card.
 */
export function CardDescription({ children, className = '', ...props }) {
  return (
    <p
      className={cn(styles.description, className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * CardContent — Main body inside a Card.
 */
export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn(styles.content, className)} {...props}>
      {children}
    </div>
  );
}

/**
 * CardFooter — Action row inside a Card.
 */
export function CardFooter({ children, className = '', ...props }) {
  return (
    <div
      className={cn(styles.footer, className)}
      {...props}
    >
      {children}
    </div>
  );
}

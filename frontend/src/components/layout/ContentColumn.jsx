/**
 * ContentColumn — Centered Content Container
 *
 * Constrains content to 640px max-width (Aura Social design system)
 * and centers it horizontally with responsive padding.
 */
export default function ContentColumn({ children, className = '' }) {
  return (
    <div className={`app-content ${className}`}>
      {children}
    </div>
  );
}

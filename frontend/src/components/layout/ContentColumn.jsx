/**
 * ContentColumn — Centered Content Container
 *
 * Constrains content to a maximum width of 640px (Aura Social spec)
 * and centers it horizontally. Used by pages to wrap their main content.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className - Additional classes
 */
export default function ContentColumn({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-[640px] px-4 md:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

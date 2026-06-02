/**
 * ProtectedAction — Interaction-Level Auth Guard
 *
 * Wraps interactive elements (buttons, clickable areas) that require
 * authentication. Instead of redirecting, it intercepts the click
 * and opens the AuthModal if the user is not logged in.
 *
 * This is the key UX pattern: guests can BROWSE freely but must
 * authenticate before INTERACTING (like, comment, save, follow).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The interactive element(s)
 * @param {Function} props.onAction - The action to execute if authenticated
 *
 * @example
 * <ProtectedAction onAction={() => handleLike(post._id)}>
 *   <IconButton icon={<FiHeart />} label="Like" />
 * </ProtectedAction>
 */
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedAction({ children, onAction }) {
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      openAuthModal('login');
      return;
    }
    onAction?.();
  };

  return (
    <div onClick={handleClick} role="presentation">
      {children}
    </div>
  );
}

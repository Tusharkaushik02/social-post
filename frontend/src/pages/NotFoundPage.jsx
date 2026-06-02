/**
 * NotFoundPage — 404 Error Page
 *
 * Catch-all page for unmatched routes.
 * Features a friendly message with floating animation and
 * a link back to the home feed.
 */
import { Link } from 'react-router-dom';
import { ROUTES } from '@/router/routes';
import ContentColumn from '@/components/layout/ContentColumn';

export default function NotFoundPage() {
  return (
    <ContentColumn>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-display-lg animate-float mb-4">404</span>
        <h1 className="text-headline-lg mb-2">Page not found</h1>
        <p className="text-body-md text-on-surface-variant mb-8 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to={ROUTES.HOME}
          className="press-scale px-6 py-3 bg-primary text-on-primary rounded-sm text-label-md"
        >
          Go back home
        </Link>
      </div>
    </ContentColumn>
  );
}

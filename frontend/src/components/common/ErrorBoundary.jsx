/**
 * ErrorBoundary — React Error Boundary
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the entire app.
 *
 * Class component because React error boundaries require
 * getDerivedStateFromError and componentDidCatch lifecycle methods.
 */
import { Component } from 'react';
import { IoRefreshOutline, IoWarningOutline } from 'react-icons/io5';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Log error to monitoring service (Sentry, etc.)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        this.props.fallback || (
          <div
            role="alert"
            className="error-fallback"
          >
            {/* Icon */}
            <div className="error-icon-badge">
              <IoWarningOutline size={28} />
            </div>

            {/* Heading */}
            <h2 className="text-headline-md" style={{ fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Something went wrong
            </h2>

            {/* Description */}
            <p className="text-body-md" style={{
              marginTop: '8px',
              maxWidth: '24rem',
              color: 'var(--color-on-surface-variant)',
            }}>
              An unexpected error occurred. Please try again.
            </p>

            {/* Try again button */}
            <button
              onClick={this.handleReset}
              className="btn btn-primary btn-md btn-pill press-scale"
              style={{ marginTop: '24px' }}
              aria-label="Try again"
            >
              <IoRefreshOutline size={17} />
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

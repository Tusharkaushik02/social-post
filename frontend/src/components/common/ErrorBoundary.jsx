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
import styles from './ErrorBoundary.module.css';

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
          <div role="alert" className={styles.fallback}>
            <div className={styles.iconBadge}>
              <IoWarningOutline size={28} />
            </div>

            <h2 className={styles.title}>
              Something went wrong
            </h2>

            <p className={styles.description}>
              An unexpected error occurred. Please try again.
            </p>

            <button
              onClick={this.handleReset}
              className={styles.button}
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

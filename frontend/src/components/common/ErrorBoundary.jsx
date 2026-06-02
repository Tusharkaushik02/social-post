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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="text-headline-md mb-2">Something went wrong</h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={this.handleReset}
              className="press-scale px-4 py-2 bg-primary text-on-primary rounded-sm"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * useIntersectionObserver Hook
 *
 * Observes when a target element enters or exits the viewport.
 * Primary use case: infinite scroll trigger (load more when the
 * sentinel element becomes visible).
 *
 * @param {object} options
 * @param {number} options.threshold - Visibility ratio to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root viewport
 * @param {boolean} options.enabled - Whether observation is active
 * @returns {{ ref: React.RefCallback, isIntersecting: boolean }}
 *
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver({
 *   threshold: 0.1,
 *   enabled: hasMore && !isLoading,
 * });
 *
 * useEffect(() => {
 *   if (isIntersecting) fetchMorePosts();
 * }, [isIntersecting]);
 *
 * return <div ref={ref} />; // sentinel element at bottom of feed
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export function useIntersectionObserver({
  threshold = 0,
  rootMargin = '100px',
  enabled = true,
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [node, setNode] = useState(null);
  const observerRef = useRef(null);

  // Ref callback — use this as the `ref` prop on the sentinel element
  const ref = useCallback((element) => {
    setNode(element);
  }, []);

  useEffect(() => {
    if (!enabled || !node) {
      return;
    }

    // Disconnect any previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(node);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [node, threshold, rootMargin, enabled]);

  return { ref, isIntersecting };
}

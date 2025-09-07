import { useState, useEffect, useRef, useCallback } from "react";

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseLazyLoadingResult {
  isVisible: boolean;
  ref: React.RefObject<HTMLElement>;
}

/**
 * Custom React hook for lazy loading elements using the Intersection Observer API.
 *
 * This hook returns a `ref` to be attached to a DOM element and a boolean `isVisible`
 * indicating whether the element is currently visible in the viewport (according to the given threshold and rootMargin).
 * It supports triggering the visibility only once or multiple times as the element enters or leaves the viewport.
 *
 * @param options - Configuration options for the lazy loading behavior.
 * @param options.threshold - A number between 0 and 1 indicating at what percentage of the target's visibility the observer's callback should be executed. Defaults to 0.1.
 * @param options.rootMargin - Margin around the root. Can have values similar to the CSS margin property (e.g., "50px"). Defaults to '50px'.
 * @param options.triggerOnce - If true, the observer will stop observing after the element becomes visible for the first time. Defaults to true.
 *
 * @returns An object containing:
 * - `isVisible`: A boolean indicating if the element is visible in the viewport.
 * - `ref`: A React ref to be attached to the target DOM element.
 *
 * @example
 * ```tsx
 * const { isVisible, ref } = useLazyLoading();
 * return <div ref={ref}>{isVisible && <Content />}</div>;
 * ```
 */
export const useLazyLoading = ({
  threshold = 0.1,
  rootMargin = "50px",
  triggerOnce = true,
}: UseLazyLoadingOptions = {}): UseLazyLoadingResult => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting) {
        setIsVisible(true);

        // If triggerOnce is true, stop observing after first intersection
        if (triggerOnce && ref.current && observerRef.current) {
          observerRef.current.unobserve(ref.current);
        }
      } else if (!triggerOnce) {
        setIsVisible(false);
      }
    },
    [triggerOnce]
  );

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // Check if IntersectionObserver is supported
    if (!("IntersectionObserver" in window)) {
      // Fallback for older browsers
      setIsVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(currentRef);

    // Cleanup function
    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { isVisible, ref };
};

/**
 * Custom React hook to preload an image and track its loading state.
 *
 * @param src - The source URL of the image to preload.
 * @returns An object containing:
 *   - `loading`: A boolean indicating if the image is still loading.
 *   - `error`: A boolean indicating if there was an error loading the image.
 *
 * @example
 * const { loading, error } = useImagePreload('https://example.com/image.jpg');
 */
export const useImagePreload = (src: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setLoading(false);
      setError(false);
    };

    img.onerror = () => {
      setLoading(false);
      setError(true);
    };

    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { loading, error };
};

/**
 * Custom React hook for lazy loading a component using dynamic import.
 *
 * @template T The type of the component to be loaded.
 * @param importFunc - A function that returns a promise resolving to an object with a `default` export (the component).
 * @param preload - If `true`, the component will be loaded immediately on mount. Defaults to `false`.
 * @returns An object containing:
 *   - `Component`: The loaded component, or `null` if not yet loaded.
 *   - `loading`: Boolean indicating if the component is currently loading.
 *   - `error`: Any error encountered during loading, or `null` if none.
 *   - `loadComponent`: Function to manually trigger the loading of the component.
 *
 * @example
 * const { Component, loading, error, loadComponent } = useLazyComponent(() => import('./MyComponent'));
 */
export const useLazyComponent = <T = unknown>(
  importFunc: () => Promise<{ default: T }>,
  preload = false
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (Component) return Component;

    setLoading(true);
    setError(null);

    try {
      const { default: LoadedComponent } = await importFunc();
      setComponent(LoadedComponent);
      setLoading(false);
      return LoadedComponent;
    } catch (err) {
      setError(err as Error);
      setLoading(false);
      return null;
    }
  }, [importFunc, Component]);

  useEffect(() => {
    if (preload) {
      loadComponent();
    }
  }, [preload, loadComponent]);

  return {
    Component,
    loading,
    error,
    loadComponent,
  };
};

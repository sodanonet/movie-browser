import { useEffect } from "react";

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

/**
 * Performance monitoring component that tracks Core Web Vitals
 * Only runs in production and when performance APIs are available
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run performance monitoring in production
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Check if performance APIs are available
    if (!("performance" in window) || !("PerformanceObserver" in window)) {
      return;
    }

    const metrics: PerformanceMetrics = {};

    // Measure First Contentful Paint (FCP)
    const measureFCP = () => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            metrics.fcp = entry.startTime;
            console.log("FCP:", entry.startTime);
          }
        }
      }).observe({ type: "paint", buffered: true });
    };

    // Measure Largest Contentful Paint (LCP)
    const measureLCP = () => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.lcp = (entry as any).startTime;
          console.log("LCP:", (entry as any).startTime);
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    };

    // Measure First Input Delay (FID)
    const measureFID = () => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.fid = (entry as any).processingStart - entry.startTime;
          console.log("FID:", metrics.fid);
        }
      }).observe({ type: "first-input", buffered: true });
    };

    // Measure Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        metrics.cls = clsValue;
        console.log("CLS:", clsValue);
      }).observe({ type: "layout-shift", buffered: true });
    };

    // Measure Time to First Byte (TTFB)
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        metrics.ttfb = navigation.responseStart - navigation.fetchStart;
        console.log("TTFB:", metrics.ttfb);
      }
    };

    // Start measuring
    try {
      measureFCP();
      measureLCP();
      measureFID();
      measureCLS();
      measureTTFB();
    } catch (error) {
      console.warn("Performance monitoring failed:", error);
    }

    // Log all metrics after 10 seconds
    const timeout = setTimeout(() => {
      console.log("Performance Metrics Summary:", metrics);

      // You could send these metrics to an analytics service here
      // Example: sendToAnalytics(metrics)
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;

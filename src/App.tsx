import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Suspense, lazy } from "react";
import { store } from "./store";
import Navigation from "./components/Navigation";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import PerformanceMonitor from "./components/ui/PerformanceMonitor";

// Lazy load route components for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const MovieDetailPage = lazy(() => import("./pages/MovieDetailPage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));

// Internal App content component (without Provider/Router)
export function AppContent() {
  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie-info/:id" element={<MovieDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

// Main App component with providers
function App() {
  return (
    <Provider store={store}>
      <Router>
        <PerformanceMonitor /> {/* Tracks metrics in production */}
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;

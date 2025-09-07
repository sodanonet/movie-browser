# Movie Browsing Web Application

A modern movie browsing application built with React, TypeScript, and Redux, featuring category-based carousels, detailed movie pages, and wishlist functionality.

## Released using free hosting [Render](https://render.com/)

<i>**Important**: Render free hosting may need to wait to restart services</i>

- Client - [https://movie-browser-hhip.onrender.com](https://movie-browser-hhip.onrender.com)
- SSR - [https://movie-browser-ssr.onrender.com](https://movie-browser-ssr.onrender.com)

## Features

- **Homepage with Category Carousels**: Browse movies across three categories (Popular, Top Rated, Now Playing) ✅
- **Detailed Movie Pages**: View comprehensive movie information with category-specific styling ✅
- **Wishlist Functionality**: Add and manage favorite movies with localStorage persistence ✅
- **Custom Confirmation Modals**: Professional modal dialogs with accessibility support ✅
- **Server-Side Rendering**: Fast initial page loads with SEO optimization ✅
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices ✅
- **TypeScript**: Full type safety throughout the application ✅
- **Comprehensive Testing**: Unit, integration, and E2E test coverage ✅

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with code splitting and performance optimizations
- **State Management**: Redux Toolkit
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Styling**: SCSS with category-based theming
- **API**: The Movie Database (TMDB) API
- **Server-Side Rendering**: Express with Vite SSR
- **Code Quality**: ESLint with TypeScript support
- **Performance**: Lazy loading with Intersection Observer API
- **Testing**: Jest + React Testing Library + Cypress + Axios Mock Adapter

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TMDB API key (sign up at https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sodanonet/movie-browser.git
cd movie-browser
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Add your TMDB API key to `.env`:

```env
VITE_TMDB_API_KEY=your_api_key_here
```

### Development

**Client-side development** (original):

```bash
npm run dev
```

The application will be available at `http://localhost:5174`

**Server-Side Rendering** (production-ready):

```bash
npm run build:ssr    # Build both client and server
npm run preview:ssr  # Start SSR server
```

The SSR version will be available at `http://localhost:3000`

### Build

**Client-side build**:

```bash
npm run build
```

**SSR build** (includes client + server):

```bash
npm run build:ssr
```

## Server-Side Rendering (SSR)

This application includes a comprehensive SSR implementation that runs alongside the existing client-side app without breaking changes.

### SSR Features

- **🚀 Fast Initial Loads**: Server-rendered HTML for instant page display
- **📈 SEO Optimized**: Search engine friendly with proper meta tags
- **🔄 Client Hydration**: Seamless transition to interactive React app
- **🎯 Route-based Rendering**: Homepage, movie details, and wishlist pages
- **📱 Production Ready**: Express server with proper asset handling

### SSR Architecture

The SSR implementation is **completely additive** and doesn't interfere with existing development:

- **Development**: Continue using `npm run dev` at `http://localhost:5174`
- **SSR Preview**: Use `npm run preview:ssr` at `http://localhost:3000`
- **Independent Builds**: Client and server builds are separate
- **Zero Breaking Changes**: Existing codebase remains untouched

### SSR vs Client-side

| Feature          | Client-side (Dev) | SSR (Production)  |
| ---------------- | ----------------- | ----------------- |
| **Port**         | `5174`            | `3000`            |
| **Initial Load** | Blank → Hydrated  | Pre-rendered HTML |
| **SEO**          | Limited           | Full meta tags    |
| **Development**  | Hot reload        | Production build  |
| **Use Case**     | Development       | Production/SEO    |

### Testing

This project implements a comprehensive three-layer testing strategy:

#### Test Types

- **Unit Tests**: Individual components and functions (Jest + React Testing Library)
- **Integration Tests**: API integration and Redux flows (Jest + Axios Mock Adapter)
- **E2E Tests**: Complete user journeys (Cypress)

#### Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e          # E2E tests (requires dev server)

# Development modes
npm run test:watch        # Unit tests in watch mode
npm run test:e2e:open     # Interactive Cypress runner

# Coverage analysis
npm run test:coverage     # Generate coverage report
```

#### Test Structure

```
src/test/
├── integration/          # API and Redux integration tests
├── mocks/               # Axios Mock Adapter API mocks and test data
└── utils/               # Custom test utilities

cypress/
├── e2e/smoke/           # Critical user journey tests
├── fixtures/            # Test data for E2E tests
└── support/             # Cypress commands and setup
```

**Current Test Status:**

- ✅ Unit tests for components and utilities
- ✅ Integration tests for API and Redux
- ✅ Wishlist functionality tests
- ✅ Navigation and routing tests
- ⏳ E2E tests (Cypress setup complete)

## Project Structure

```
src/
├── components/             # Reusable UI components
│   ├── carousel/           # Carousel-specific components
│   ├── movie/              # Movie card and detail components
│   └── ui/                 # Generic UI primitives
├── hooks/                  # Custom React hooks (lazy loading, preloading)
├── pages/                  # Route-level components
├── services/               # API integration layer
├── ssr/                    # Server-Side Rendering components
│   └── entry-server.tsx    # SSR entry point
├── store/                  # Redux store and slices
├── test/                   # Test utilities, mocks, and integration tests
├── types/                  # TypeScript type definitions
├── styles/                 # SCSS files and themes
└── utils/                  # Helper functions
.eslintrc.cjs               # ESLint configuration
ssr-server.js               # Express SSR server
```

## API Integration

This application integrates with The Movie Database (TMDB) API for comprehensive movie data:

### Endpoints Used

- `/movie/popular` - Popular movies for homepage carousel
- `/movie/top_rated` - Top-rated movies for homepage carousel
- `/movie/now_playing` - Currently playing movies for homepage carousel
- `/movie/{id}` - Detailed movie information for detail pages
- `/search/movie` - Movie search functionality (future enhancement)

### Features

- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Request Interceptors**: Automatic request logging and authentication
- **Response Caching**: Redux-based caching to minimize API calls
- **Loading States**: Professional loading indicators during data fetching
- **Data Validation**: Input validation and response data verification
- **Mock Support**: Axios Mock Adapter for testing environments

## Category Theming

The application features comprehensive category-specific theming:

### Visual Design

- **Popular Movies**: Modern, clean design with blue accents (#3b82f6)
- **Top Rated**: Premium, elegant styling with gold accents (#f59e0b)
- **Now Playing**: Dynamic, energetic theme with red accents (#ef4444)

### Implementation Details

- Dynamic CSS custom properties for theme switching
- Category-specific backdrop overlays on movie detail pages
- Consistent color schemes across carousels and detail pages
- Hover effects and animations aligned with category themes
- Responsive design maintaining theme consistency across devices

### Interactive Features

- Smooth carousel navigation with category-themed indicators
- Movie detail pages with immersive backdrop images
- Category-aware wishlist buttons with visual feedback
- Professional loading states and error handling
- Custom confirmation modals with keyboard navigation and accessibility
- Elegant modal animations with fade-in/slide-in effects

## Completed Features

### Core Application

- ✅ **Project Setup**: Vite + React + TypeScript configuration
- ✅ **API Integration**: TMDB API service layer with Axios and proper error handling
- ✅ **State Management**: Redux Toolkit setup with movies and wishlist slices
- ✅ **Homepage**: Three category-based carousels (Popular, Top Rated, Now Playing)
- ✅ **Movie Details**: Comprehensive detail pages with category-specific styling
- ✅ **Wishlist**: Full CRUD functionality with Redux integration and localStorage persistence

### Development & Quality

- ✅ **Testing**: Unit, integration, and E2E test framework setup with Axios Mock Adapter
- ✅ **Responsive Design**: Mobile-first SCSS architecture with cross-device compatibility
- ✅ **Accessibility**: WCAG-compliant interface elements and keyboard navigation
- ✅ **SASS Compilation**: Fixed import paths, file naming conventions, and compilation errors
- ✅ **Environment Variables**: Resolved Vite browser compatibility issues with import.meta.env
- ✅ **ESLint Configuration**: Comprehensive TypeScript and React linting setup
- ✅ **Performance Optimization**: Lazy loading, code splitting, and bundle optimization
- ✅ **UI Components**: Reusable modal dialogs and confirmation components
- ✅ **Server-Side Rendering**: Vite SSR configuration for production optimization
- ✅ **Documentation**: Comprehensive project documentation and testing strategy

The application is now fully functional with all core features complete and technical issues resolved.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie data API
- [Vite](https://vitejs.dev/) for the excellent build tool
- [Redux Toolkit](https://redux-toolkit.js.org/) for state management

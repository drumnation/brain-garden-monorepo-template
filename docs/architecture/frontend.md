---
title: "Frontend Architecture"
description: "React-based frontend applications with Electron desktop support"
keywords: [frontend, architecture, react, electron, vite, mantine]
last_updated: "2025-11-08"
status: "ACTIVE DOCUMENTATION"
---

# Frontend Architecture

## 1. Overview

The Dev Garden frontend consists of two React-based applications:
- **Web Application** - Browser-based SPA built with Vite
- **Desktop Application** - Electron-wrapped React app for native desktop

Both applications share components and utilities through the monorepo structure, ensuring consistency and code reuse.

**Key Characteristics:**
- **Framework:** React 18.3 with TypeScript
- **Build Tool:** Vite 6.0 for fast development
- **UI Library:** Mantine 7.15 for component library
- **State Management:** Zustand 5.0 for global state
- **Desktop:** Electron 33.2 for cross-platform desktop
- **Styling:** Mantine's built-in styling system

## 2. Technology Stack

### Shared Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18.3 | UI component library |
| **Language** | TypeScript 5.7 | Type safety |
| **Build Tool** | Vite 6.0 | Development and production builds |
| **State Management** | Zustand 5.0 | Application state management |
| **UI Components** | Mantine 7.15 | Pre-built component library |
| **Routing** | React Router 6.28 | Client-side navigation (web only) |
| **Testing** | Vitest | Unit and integration tests |
| **Code Quality** | ESLint + Prettier | Code formatting and linting |

### Desktop-Specific Technologies

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Desktop Framework** | Electron 33.2 | Native desktop wrapper |
| **Builder** | electron-builder 25.1 | Cross-platform packaging |
| **IPC** | Electron IPC | Main-renderer communication |
| **Preload Scripts** | Electron Preload | Secure context bridge |

## 3. Application Structure

### Web Application (`apps/web`)

```
apps/web/
├── src/
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   ├── components/          # Shared components
│   ├── features/            # Feature modules
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities
│   ├── store/               # Zustand stores
│   └── types/               # TypeScript types
├── public/                  # Static assets
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── package.json
└── tsconfig.json
```

### Desktop Application (`apps/desktop`)

```
apps/desktop/
├── src/
│   ├── main/               # Electron main process
│   │   └── index.ts        # Main process entry
│   ├── preload/            # Preload scripts
│   │   └── index.ts        # Context bridge
│   └── renderer/           # React application
│       ├── App.tsx         # Root component
│       └── main.tsx        # Renderer entry
├── electron-builder.json   # Build configuration
├── vite.config.ts         # Vite configuration
├── package.json
└── tsconfig.json
```

## 4. Component Architecture

### Component Organization

Components follow a hierarchical structure:

1. **Atomic Components** (`packages/shared-ui/src/atoms/`)
   - Basic building blocks (Button, Input, Text)
   - Highly reusable across applications

2. **Feature Components** (`apps/*/src/features/`)
   - Domain-specific components
   - Self-contained with their own state

3. **Layout Components** (`apps/*/src/components/layout/`)
   - Page layouts and navigation
   - Application shells

### Component Pattern

```tsx
// Example component structure
interface ComponentNameProps {
  title: string;
  onAction?: () => void;
  children?: React.ReactNode;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  onAction,
  children
}) => {
  // Component implementation
  return (
    <div>
      <h2>{title}</h2>
      {children}
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
};
```

## 5. State Management

### Zustand Store Pattern

Global state is managed with Zustand stores:

```typescript
// store/appStore.ts
import { create } from 'zustand';

interface AppState {
  user: User | null;
  projects: Project[];
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  loadProjects: () => Promise<void>;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  projects: [],
  isLoading: false,

  setUser: (user) => set({ user }),

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await fetchProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  reset: () => set({ user: null, projects: [] })
}));
```

### State Management Strategy

1. **Component State** - Use `useState` for local UI state
2. **Global State** - Use Zustand for cross-component state
3. **Server State** - Use React Query (planned) for API data
4. **Form State** - Use controlled components or React Hook Form (planned)

## 6. Routing (Web Application)

The web application uses React Router for client-side navigation:

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 7. Electron Architecture (Desktop)

### Process Architecture

The desktop application uses Electron's multi-process architecture:

1. **Main Process** (`src/main/index.ts`)
   - Manages application lifecycle
   - Creates browser windows
   - Handles system integration
   - IPC communication hub

2. **Renderer Process** (`src/renderer/`)
   - Runs the React application
   - Isolated from system APIs
   - Communicates via IPC

3. **Preload Script** (`src/preload/index.ts`)
   - Bridge between main and renderer
   - Exposes safe APIs to renderer

### IPC Communication

```typescript
// preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Safe API exposure
  getProjects: () => ipcRenderer.invoke('get-projects'),
  saveProject: (project: Project) => ipcRenderer.invoke('save-project', project),

  // Event listeners
  onProjectUpdate: (callback: (project: Project) => void) => {
    ipcRenderer.on('project-updated', (_, project) => callback(project));
  }
});

// main/index.ts
ipcMain.handle('get-projects', async () => {
  return await loadProjects();
});

ipcMain.handle('save-project', async (_, project: Project) => {
  return await saveProject(project);
});
```

## 8. UI Component Library (Mantine)

### Mantine Configuration

```tsx
// main.tsx or App.tsx
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';

export function App() {
  return (
    <MantineProvider
      theme={{
        primaryColor: 'blue',
        fontFamily: 'Inter, sans-serif',
        defaultRadius: 'md',
      }}
    >
      {/* Application content */}
    </MantineProvider>
  );
}
```

### Common Components Used

- **Layout:** AppShell, Container, Grid
- **Navigation:** NavLink, Tabs, Breadcrumbs
- **Forms:** TextInput, Select, Checkbox, Button
- **Feedback:** Notification, Modal, Alert
- **Data Display:** Table, Card, Badge

## 9. Build & Development

### Development Workflow

```bash
# Web application
cd apps/web
pnpm dev              # Start dev server at http://localhost:5173

# Desktop application
cd apps/desktop
pnpm dev              # Start Electron app in development mode

# Run from monorepo root
pnpm --filter @dev-garden/web dev
pnpm --filter @dev-garden/desktop dev
```

### Production Build

```bash
# Web application
pnpm --filter @dev-garden/web build
# Output: apps/web/dist/

# Desktop application
pnpm --filter @dev-garden/desktop build
# Output: apps/desktop/release/
```

### Build Configuration

**Vite Configuration (Web):**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

**Electron Builder Configuration:**
```json
{
  "appId": "com.dev-garden.desktop",
  "productName": "Dev Garden PM",
  "directories": {
    "output": "release/${version}"
  },
  "mac": {
    "target": ["dmg", "zip"]
  },
  "win": {
    "target": ["nsis", "zip"]
  },
  "linux": {
    "target": ["AppImage", "deb"]
  }
}
```

## 10. Testing Strategy

### Test Types

1. **Component Tests** - Test individual components in isolation
2. **Integration Tests** - Test feature workflows
3. **E2E Tests** - Test full user journeys (planned)

### Test Setup

```typescript
// Example component test
import { render, screen } from '@testing-library/react';
import { ProjectCard } from './ProjectCard';

describe('ProjectCard', () => {
  it('displays project name', () => {
    const project = { name: 'Test Project', id: '1' };
    render(<ProjectCard project={project} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
  });
});
```

## 11. Performance Optimization

### Current Optimizations

1. **Code Splitting** - Dynamic imports for routes
2. **Memoization** - React.memo for expensive components
3. **Virtual Scrolling** - For large lists (planned)
4. **Image Optimization** - Lazy loading and responsive images

### Build Optimizations

- Tree shaking via Vite
- Minification and compression
- Asset optimization
- Bundle splitting

## 12. Future Enhancements

### Planned Features

1. **PM Agent UI Features**
   - Motivation dashboard
   - Project quality visualization
   - Session tracking interface
   - Screenshot gallery

2. **Technical Improvements**
   - React Query for server state
   - React Hook Form for complex forms
   - Playwright for E2E testing
   - Storybook for component documentation

3. **Desktop Enhancements**
   - System tray integration
   - Native notifications
   - File system integration
   - Auto-updater

## Related Documentation

- [System Overview](./system-overview.md) - High-level architecture
- [Backend Architecture](./backend.md) - API server documentation
- [Database Architecture](./database.md) - Data layer
- [Component Design](../../.cursor/rules/component-design-decision-tree.rules.mdc) - Component patterns

---

**Last Updated:** 2025-11-08
**Status:** Active Documentation
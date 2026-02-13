# 🚀 Astro + React Admin Dashboard Boilerplate

A modern, production-ready admin dashboard boilerplate built with Astro, React, Ant Design, and TailwindCSS. Designed as a solid foundation for building scalable back-office applications.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Admin+Dashboard+Preview)

## ✨ Features

- **⚡ High Performance**: Powered by [Astro](https://astro.build/) for fast initial load and server-side rendering.
- **⚛️ React Islands**: Interactive UI components using [React 19](https://react.dev/).
- **🎨 Modern UI**: Beautiful and accessible components from [Ant Design v6](https://ant.design/) + [TailwindCSS v4](https://tailwindcss.com/).
- **🔐 Robust Auth**: Built-in authentication flow with JWT (access + refresh tokens), Axios interceptors, and auto-logout.
- **📡 Data Fetching**: [TanStack Query v5](https://tanstack.com/query/latest) for powerful async state management, caching, and optimistic updates.
- **🔔 Notifications**: Centralized pub/sub notification system.
- **📱 Responsive**: Fully responsive layout with collapsible sidebar and mobile support.
- **🛣️ Client-side Routing**: [React Router v7](https://reactrouter.com/) for smooth navigation within the admin panel.

## 🛠️ Tech Stack

- **Framework**: Astro 5.0 (Node.js Adapter)
- **UI Library**: React 19 + Ant Design 6.0
- **Styling**: TailwindCSS 4.0
- **State/Query**: TanStack Query 5.0
- **HTTP Client**: Axios
- **Language**: TypeScript

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url> my-admin
   cd my-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Copy `.env.example` to `.env` and configure your API URL:

   ```bash
   cp .env.example .env
   ```

   ```env
   PUBLIC_API_BASE_URL=http://localhost:3000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321) in your browser.

## 📂 Project Structure

```
src/
├── layouts/          # Astro base layouts (HTML shell)
├── lib/              # Core utilities (non-UI)
│   ├── auth.ts       # Token & profile management
│   ├── axios.ts      # API client with interceptors
│   ├── queryClient.ts# Query client with global error handling
│   └── notifier.ts   # Notification bus
├── pages/            # Astro file-based routing
│   ├── index.astro   # Root redirect logic
│   ├── login.astro   # Login page
│   └── admin/        # Admin SPA entry point
├── react/            # React application logic
│   ├── layouts/      # App layouts (Sidebar, Header)
│   ├── pages/        # Application pages (Dashboard, Settings, etc.)
│   └── providers/    # Global providers (AntD, QueryClient)
└── styles/           # Global CSS & Tailwind imports
```

## 📖 Key Documentation

For detailed usage guides, please refer to [BOILERPLATE.md](./BOILERPLATE.md), which covers:

- Adding new pages & routes
- Updating sidebar menu
- Using API hooks
- Customizing the theme
- Deployment instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

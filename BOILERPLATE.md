# 🚀 Boilerplate — Astro + React Admin Dashboard

Boilerplate website admin dashboard menggunakan **Astro**, **React**, **Ant Design v6**, **TailwindCSS v4**, **React Router**, **TanStack Query**, dan **Axios**. Cocok digunakan sebagai starting point untuk project admin panel / back-office.

---

## Quick Start

```bash
# 1. Clone repository
git clone <repo-url> my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env dan isi PUBLIC_API_BASE_URL dengan URL API backend Anda

# 4. Jalankan development server
npm run dev
# Buka http://localhost:4321
```

---

## 📁 Struktur Folder

```
├── public/                   # Static assets (favicon, images, dll)
├── src/
│   ├── layouts/
│   │   └── Layout.astro      # Base HTML layout (head, meta tags)
│   ├── lib/                  # Utility libraries (non-React)
│   │   ├── auth.ts           # Token & profile management (localStorage)
│   │   ├── axios.ts          # Axios instance + interceptors + auto refresh
│   │   ├── config.ts         # API base URL config
│   │   ├── notifier.ts       # Pub/sub notification bus
│   │   ├── queryClient.ts    # TanStack Query client + global error handler
│   │   ├── router.ts         # React Router re-exports
│   │   └── site.ts           # Site title, description, icon
│   ├── pages/                # Astro pages (routing)
│   │   ├── index.astro       # Root: redirect ke /admin atau tampilkan login
│   │   ├── login.astro       # Halaman login
│   │   └── admin/
│   │       ├── index.astro   # Entry point admin (guard token)
│   │       └── [...rest].astro # Catch-all untuk SPA routing
│   ├── react/                # React components & pages
│   │   ├── layouts/
│   │   │   └── AppLayout.tsx # Layout: Sidebar + Header + Content
│   │   ├── pages/
│   │   │   ├── AdminApp.tsx  # Admin routing shell (routes, error boundary)
│   │   │   ├── Dashboard.tsx # Demo dashboard
│   │   │   ├── Login.tsx     # Login form
│   │   │   ├── LoginApp.tsx  # Login page wrapper
│   │   │   ├── SamplePage.tsx# Demo CRUD table
│   │   │   └── Settings.tsx  # Demo settings form
│   │   └── providers/
│   │       ├── AppProviders.tsx            # Root providers (Ant Design + Query)
│   │       └── GlobalNotificationBridge.tsx # Notifier → Ant notification
│   └── styles/
│       └── global.css        # Global styles + Ant Design reset + Tailwind
├── .env.example              # Template environment variables
├── astro.config.mjs          # Astro + Vite config
├── package.json
└── tsconfig.json
```

---

## 📝 Cara Menambah Halaman Baru

### 1. Buat file komponen React

```tsx
// src/react/pages/MyNewPage.tsx
import { Card, Typography } from 'antd';

export default function MyNewPage() {
  return (
    <>
      <Typography.Title level={4}>My New Page</Typography.Title>
      <Card>
        <p>Hello World!</p>
      </Card>
    </>
  );
}
```

### 2. Daftarkan route di `AdminApp.tsx`

```tsx
// src/react/pages/AdminApp.tsx
const MyNewPage = lazy(() => import('./MyNewPage'));

// Di dalam <Routes>:
<Route path="my-page" element={<MyNewPage />} />
```

### 3. Tambahkan menu di `AppLayout.tsx`

```tsx
// src/react/layouts/AppLayout.tsx
import { AppstoreOutlined } from '@ant-design/icons';

// Di array menuItems:
{
  key: 'my-page',
  icon: <AppstoreOutlined />,
  label: 'My Page',
  href: '/my-page',
},
```

### 4. Update PREFIX_KEYS

```tsx
// Di AppLayout.tsx
const PREFIX_KEYS = ['sample', 'settings', 'my-page']; // tambahkan key baru
```

### 5. Update TitleSync (opsional)

```tsx
// Di AdminApp.tsx, dalam fungsi TitleSync:
if (p.startsWith('/my-page')) label = 'My Page';
```

---

## 🔄 Cara Menggunakan API Hook (TanStack Query)

### Query (GET)

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '@lib/axios';

function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
  });
}

// Di komponen:
function UserList() {
  const { data, isLoading, error } = useUsers();

  if (isLoading) return <Spin />;
  // render data...
}
```

### Mutation (POST/PUT/DELETE)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@lib/axios';

function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-user'],
    mutationFn: async (data: { name: string; email: string }) => {
      const res = await api.post('/users', data);
      return res.data;
    },
    onSuccess: () => {
      // Refresh data setelah create
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Di komponen:
const createUser = useCreateUser();
createUser.mutate({ name: 'John', email: 'john@example.com' });
```

> **Note:** Error dan success notification otomatis ditampilkan oleh `queryClient.ts`. Tidak perlu handling manual.

---

## 🔐 Auth System

### Alur Autentikasi

1. User submit form login → `POST /auth/login`
2. API mengembalikan `{ accessToken, refreshToken, profile }`
3. Token disimpan di `localStorage`
4. Setiap API request, token otomatis dilampirkan via Axios interceptor
5. Jika token expired (401), interceptor otomatis refresh token
6. Jika refresh gagal, user diredirect ke login

### Menyesuaikan Auth

Edit `src/lib/auth.ts`:
- Ubah `ACCESS_TOKEN_KEY`, `REFRESH_TOKEN_KEY` sesuai project
- Ubah `UserProfile` interface sesuai response API Anda

Edit `src/lib/axios.ts`:
- Ubah endpoint refresh token (`/auth/refresh-token`) sesuai API
- Ubah parsing response `response.data.data.accessToken` sesuai API

Edit `src/react/pages/Login.tsx`:
- Ubah endpoint login (`/auth/login`) sesuai API
- Ubah parsing response sesuai structure API Anda

---

## 🎨 Customize Theme Ant Design

Edit `src/react/providers/AppProviders.tsx`:

```tsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1677FF',     // Warna utama
      borderRadius: 8,              // Border radius global
      fontFamily: "'Inter', sans-serif",
    },
    components: {
      Button: {
        borderRadius: 8,
      },
      Card: {
        borderRadius: 12,
      },
    },
  }}
>
```

Referensi lengkap: [Ant Design Theme Editor](https://ant.design/theme-editor)

---

## 🌐 Environment Variables

| Variable | Deskripsi | Default |
|---|---|---|
| `PUBLIC_API_BASE_URL` | Base URL API backend | `http://localhost:3000` |
| `PUBLIC_SITE_TITLE` | Judul website | `My App` |
| `PUBLIC_SITE_DESCRIPTION` | Deskripsi meta | `Admin Dashboard` |
| `PUBLIC_SITE_ICON` | Path favicon | `/favicon.svg` |

> Semua env vars yang diakses di client harus menggunakan prefix `PUBLIC_`.

---

## 🚢 Deployment

### Build

```bash
npm run build
```

### Run (standalone Node.js)

```bash
node dist/server/entry.mjs
```

### Docker (contoh)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
```

---

## 📋 NPM Scripts

| Script | Deskripsi |
|---|---|
| `npm run dev` | Jalankan dev server (hot reload) |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run format` | Format code dengan Prettier |
| `npm run format:check` | Cek code formatting |

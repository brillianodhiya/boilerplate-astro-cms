import { type PropsWithChildren, useState, useEffect } from 'react';
import { Layout, Menu, Typography, Grid, Dropdown, Avatar, Button } from 'antd';
import {
  UserOutlined,
  CaretDownOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { clearAuthData, getUserProfile } from '../../lib/auth';
import { useLocation, useNavigate } from '@lib/router';

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

// ─── Menu Configuration ───────────────────────────────────────
// Tambahkan menu item di sini untuk menambah halaman baru
type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  href?: string;
  children?: MenuItem[];
};

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    href: '/',
  },
  {
    key: 'sample',
    icon: <FileTextOutlined />,
    label: 'Sample Page',
    href: '/sample',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    href: '/settings',
  },
];

// ─── Helpers ──────────────────────────────────────────────────
const PREFIX_KEYS = ['sample', 'settings'];

function pathToKey(pathname: string) {
  if (pathname === '/' || pathname === '') return 'dashboard';
  const match = PREFIX_KEYS.find((k) => pathname.startsWith(`/${k}`));
  return match ?? 'dashboard';
}

// ─── Layout Component ─────────────────────────────────────────
export function AppLayout({ children }: PropsWithChildren) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(() => {
    if (isMobile) return true;
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? saved === 'true' : false;
  });

  const profile = getUserProfile();
  const selectedKey = pathToKey(pathname);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={(value) => {
          setCollapsed(value);
          if (!isMobile) {
            localStorage.setItem('sidebarCollapsed', String(value));
          }
        }}
        breakpoint="md"
        collapsedWidth={isMobile ? 0 : 80}
        width={220}
        theme="light"
      >
        {/* Logo / Brand */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #1677FF 0%, #36CFC9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            B
          </div>
          {!collapsed && (
            <Typography.Text strong style={{ fontSize: 16 }}>
              Boilerplate
            </Typography.Text>
          )}
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          items={menuItems as any}
          selectedKeys={[selectedKey]}
          style={{ borderInlineEnd: 0 }}
          onClick={(info) => {
            const flat = menuItems.flatMap((m) => (m.children ? m.children : m));
            const item = flat.find((i) => i.key === info.key);
            if (item?.href) navigate(item.href);
          }}
        />
      </Sider>

      {/* ── Main Area ── */}
      <Layout>
        {/* Header */}
        <Header
          style={{
            background: '#fff',
            paddingLeft: 16,
            paddingRight: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed((c) => !c)}
                aria-label="Toggle sidebar"
              />
            ) : (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  const newValue = !collapsed;
                  setCollapsed(newValue);
                  localStorage.setItem('sidebarCollapsed', String(newValue));
                }}
                aria-label="Toggle sidebar"
                style={{ fontSize: '18px' }}
              />
            )}
          </div>

          {/* User dropdown */}
          <Dropdown
            placement="bottomRight"
            trigger={['click']}
            menu={{
              items: [
                { label: 'Profile', key: 'profile' },
                { type: 'divider' },
                { label: 'Logout', key: 'logout', danger: true },
              ],
              onClick: (info) => {
                if (info.key === 'logout') {
                  clearAuthData();
                  if (typeof window !== 'undefined') window.location.href = '/login';
                }
              },
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderRadius: 999,
                padding: '4px 12px 4px 4px',
                background: '#FAFAFA',
                cursor: 'pointer',
              }}
            >
              <Avatar
                size={28}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1677FF' }}
              />
              {!isMobile && profile?.fullName && (
                <Typography.Text ellipsis style={{ maxWidth: 120 }}>
                  {profile.fullName}
                </Typography.Text>
              )}
              <CaretDownOutlined style={{ fontSize: 10, color: '#999' }} />
            </div>
          </Dropdown>
        </Header>

        {/* Content */}
        <Content style={{ background: '#fff' }}>
          <div
            style={{
              background: '#FAFAFA',
              boxShadow:
                '0px 2px 4px 0px #00000005, 0px 1px 6px -1px #00000005, 0px 1px 2px 0px #00000008',
              borderStyle: 'solid',
              borderColor: '#D9D9D9',
              borderWidth: '1px 0px 0px 1px',
              borderTopLeftRadius: 12,
              padding: selectedKey === 'dashboard' ? 0 : 24,
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

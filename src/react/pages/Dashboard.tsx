import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// ─── Stat Card Component ──────────────────────────────────────
function StatCard({
  title,
  value,
  prefix,
  suffix,
  icon,
  color,
}: {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card
      style={{ borderRadius: 12 }}
      styles={{ body: { padding: 20 } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 14 }}>
            {title}
          </Text>
          <Statistic
            value={value}
            prefix={prefix}
            suffix={suffix}
            styles={{
              content: { fontSize: 28, fontWeight: 600 },
            }}
          />
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: '#fff',
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────
export default function Dashboard() {
  return (
    <div style={{ padding: 24 }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Users"
            value={12480}
            icon={<UserOutlined />}
            color="linear-gradient(135deg, #1677FF 0%, #36CFC9 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Orders"
            value={3842}
            icon={<ShoppingCartOutlined />}
            color="linear-gradient(135deg, #722ED1 0%, #EB2F96 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Revenue"
            value={28500000}
            prefix="Rp"
            icon={<RiseOutlined />}
            color="linear-gradient(135deg, #52C41A 0%, #36CFC9 100%)"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Reports"
            value={156}
            icon={<FileTextOutlined />}
            color="linear-gradient(135deg, #FA8C16 0%, #FADB14 100%)"
          />
        </Col>
      </Row>

      {/* Info Card */}
      <Card style={{ marginTop: 24, borderRadius: 12 }}>
        <Title level={5}>Welcome to the Boilerplate! 🚀</Title>
        <Text type="secondary">
          This is a demo dashboard with placeholder data. Replace the stat cards above with real
          data from your API using TanStack Query hooks. See <code>BOILERPLATE.md</code> for
          detailed instructions on how to add your own pages, API hooks, and menu items.
        </Text>
        <div style={{ marginTop: 16 }}>
          <Title level={5} style={{ marginBottom: 8 }}>Quick Start:</Title>
          <ul style={{ color: '#666', lineHeight: 2 }}>
            <li>📁 Add new pages in <code>src/react/pages/</code></li>
            <li>🔗 Register routes in <code>src/react/pages/AdminApp.tsx</code></li>
            <li>📋 Add menu items in <code>src/react/layouts/AppLayout.tsx</code></li>
            <li>🔄 Create API hooks using <code>useQuery</code> from <code>@tanstack/react-query</code></li>
            <li>⚙️ Configure your API URL in <code>.env</code></li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

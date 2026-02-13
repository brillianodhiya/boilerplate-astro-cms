import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Typography, Alert, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { setAuthData, isLoggedIn } from '@lib/auth';
import { api } from '@lib/axios';

const { Title } = Typography;

const REMEMBERED_EMAIL_KEY = 'bp_remembered_email';

interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Redirect jika sudah login
  useEffect(() => {
    if (isLoggedIn()) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin';
      }
    }
  }, []);

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (rememberedEmail) {
      form.setFieldsValue({
        email: rememberedEmail,
        remember: true,
      });
    }
  }, [form]);

  async function onFinish(values: LoginFormValues) {
    setLoading(true);
    setError(null);

    // Handle Remember Me
    if (values.remember) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, values.email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    try {
      // ── Sesuaikan endpoint dan response structure dengan API Anda ──
      const response = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      const { accessToken, refreshToken, profile } = response.data.data;

      if (!accessToken || !refreshToken || !profile) {
        throw new Error('Authentication data is incomplete');
      }

      // Simpan data autentikasi
      setAuthData(accessToken, refreshToken, profile);

      // Redirect ke halaman admin
      if (typeof window !== 'undefined') {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      console.error('Login error:', err);

      const status = err?.response?.status;
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;

      if (apiMessage) {
        setError(apiMessage);
      } else if (status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else if (!err?.response) {
        setError('Unable to connect to the server. Please check your network.');
      } else {
        setError('Login failed. A server error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Card
          style={{
            width: '100%',
            boxShadow:
              '0px 9px 28px 8px #0000000D, 0px 3px 6px -4px #0000001F, 0px 6px 16px 0px #00000014',
            border: '1px solid #F0F0F0',
            borderRadius: 12,
          }}
          styles={{
            body: {
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            },
          }}
        >
          {/* Logo */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1677FF 0%, #36CFC9 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            B
          </div>

          <Title level={3} style={{ marginBottom: 8, textAlign: 'center' }}>
            Sign In
          </Title>
          <Typography.Text
            type="secondary"
            style={{
              display: 'block',
              textAlign: 'center',
              marginBottom: 24,
              fontSize: 14,
            }}
          >
            Enter your credentials to access the dashboard.
          </Typography.Text>

          {error && (
            <Alert
              type="error"
              message={error}
              style={{ marginBottom: 16, width: '100%' }}
              closable
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
            style={{ width: '100%' }}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' },
              ]}
            >
              <Input
                size="large"
                placeholder="Email"
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                autoComplete="username"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
              style={{ marginBottom: 12 }}
            >
              <Input.Password
                size="large"
                placeholder="Password"
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                autoComplete="current-password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 24 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              disabled={loading}
              style={{ height: 44 }}
            >
              Log in
            </Button>
          </Form>
        </Card>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#999',
          fontSize: 13,
        }}
      >
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
}

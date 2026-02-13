import { Card, Form, Input, Button, Typography, Divider, Switch, App } from 'antd';

const { Title, Text } = Typography;

export default function Settings() {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const handleSave = (values: any) => {
    console.log('Settings saved:', values);
    message.success('Settings saved successfully!');
  };

  return (
    <>
      <Title level={4} style={{ marginBottom: 16 }}>
        Settings
      </Title>

      <Card style={{ borderRadius: 12, maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            siteName: 'My App',
            siteDescription: 'Admin Dashboard',
            emailNotifications: true,
          }}
        >
          <Title level={5}>General</Title>
          <Form.Item
            name="siteName"
            label="Site Name"
            rules={[{ required: true, message: 'Please enter site name' }]}
          >
            <Input placeholder="Enter site name" />
          </Form.Item>

          <Form.Item
            name="siteDescription"
            label="Site Description"
          >
            <Input.TextArea rows={3} placeholder="Enter site description" />
          </Form.Item>

          <Divider />

          <Title level={5}>Notifications</Title>
          <Form.Item
            name="emailNotifications"
            label="Email Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

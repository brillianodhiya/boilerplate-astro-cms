import { type PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp } from 'antd';
import { queryClient } from '../../lib/queryClient';
import { GlobalNotificationBridge } from './GlobalNotificationBridge';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        },
      }}
    >
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <GlobalNotificationBridge />
          {children}
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}

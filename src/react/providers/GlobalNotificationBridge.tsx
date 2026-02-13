import { useEffect } from 'react';
import { App as AntApp } from 'antd';
import { subscribe, type NotifyPayload } from '@lib/notifier';

export function GlobalNotificationBridge() {
  const { notification } = AntApp.useApp();

  useEffect(() => {
    const unsub = subscribe((p: NotifyPayload) => {
      const base = {
        title: p.message,
        description: p.description,
        placement: p.placement ?? 'topRight',
      } as any;

      if (p.kind === 'error') notification.error(base);
      else if (p.kind === 'success') notification.success(base);
      else if (p.kind === 'warning') notification.warning(base);
      else notification.info(base);
    });
    return () => unsub();
  }, [notification]);

  return null;
}

export type NotifyPayload = {
  kind: 'error' | 'success' | 'info' | 'warning';
  message: string;
  description?: string;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
};

type Listener = (payload: NotifyPayload) => void;

const listeners: Listener[] = [];

export function notify(payload: NotifyPayload) {
  for (const l of listeners) {
    try {
      l(payload);
    } catch {}
  }
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export const SITE_TITLE = import.meta.env.PUBLIC_SITE_TITLE ?? 'My App';
export const SITE_DESCRIPTION = import.meta.env.PUBLIC_SITE_DESCRIPTION ?? 'Admin Dashboard';
export const SITE_ICON = import.meta.env.PUBLIC_SITE_ICON ?? '/favicon.svg';

export function formatTitle(page?: string) {
  return page ? `${page} | ${SITE_TITLE}` : SITE_TITLE;
}

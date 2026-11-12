/**
 * Fullscreen for the best view. Browsers only allow it from a click or a key press, so it is asked
 * for on the visitor's first one (the opening "Begin" buttons, the fly page's "Engage").
 */
export function enterFullscreen(): void {
  const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
  if (document.fullscreenElement) return;
  try {
    if (el.requestFullscreen) void el.requestFullscreen({ navigationUI: 'hide' }).catch(() => undefined);
    else el.webkitRequestFullscreen?.();
  } catch {
    /* not allowed here (an iframe, or a browser without the API) */
  }
}

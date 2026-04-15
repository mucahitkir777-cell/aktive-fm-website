export function sendInternalPageView(path: string) {
  if (typeof window === "undefined" || !path) {
    return;
  }

  void fetch("/api/track/pageview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      path,
      userAgent: window.navigator.userAgent,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

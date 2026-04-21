interface InternalPageViewOptions {
  defer?: boolean;
}

function runWhenIdle(task: () => void) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => task(), { timeout: 2000 });
    return;
  }

  window.setTimeout(task, 1200);
}

export function sendInternalPageView(path: string, options: InternalPageViewOptions = {}) {
  if (typeof window === "undefined" || !path) {
    return;
  }

  const request = () => {
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
  };

  if (options.defer) {
    runWhenIdle(request);
    return;
  }

  request();
}

import * as Sentry from "@sentry/nextjs";
if (process.env.NEXT_PUBLIC_SENTRY_DSN)
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      databaseQueryData: false,
      queues: false,
      stackFrameVariables: false,
      genAI: { inputs: false, outputs: false },
    },
    integrations: [],
    beforeSend(event) {
      delete event.breadcrumbs;
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }
      return event;
    },
  });
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

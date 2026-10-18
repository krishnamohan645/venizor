import * as Sentry from "@sentry/nextjs";
export async function register() {
  if (process.env.SENTRY_DSN)
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV,
      tracesSampleRate: 0.05,
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
      beforeSend(event) {
        delete event.request?.data;
        if (event.request) {
          delete event.request.cookies;
          delete event.request.headers;
        }
        return event;
      },
    });
}
export const onRequestError = Sentry.captureRequestError;

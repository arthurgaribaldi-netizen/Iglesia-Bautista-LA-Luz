// Temporarily disabled Sentry to debug build issues
// import * as Sentry from '@sentry/nextjs';

// Sentry.init({
//   dsn: process.env.SENTRY_DSN,
//   environment: process.env.NODE_ENV,
//   tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
//   beforeSend(event) {
//     // Filter out non-critical errors in production
//     if (process.env.NODE_ENV === 'production') {
//       if (event.exception) {
//         const error = event.exception.values?.[0];
//         if (error?.type === 'ChunkLoadError' || error?.type === 'Loading chunk') {
//           return null;
//         }
//       }
//     }
//     return event;
//   },
// });

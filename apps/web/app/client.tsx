/// <reference types="vinxi/types/client" />
import { StartClient } from "@tanstack/react-start";
import { hydrateRoot } from "react-dom/client";
import { createRouter } from "./router";

// Sentry.init({
//   dsn: 'https://62511c7ac27550eab578091171ecc3ca@o251649.ingest.us.sentry.io/4507430461112320',
//   integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
//   // Performance Monitoring
//   tracesSampleRate: 1.0, //  Capture 100% of the transactions
//   // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
//   tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
//   // Session Replay
//   replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//   replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
//   environment: process.env.NODE_ENV == 'development' ? 'development' : 'production',
// });
// console.info('GIT_TYPE: ', import.meta.env.VITE_GIT_REF_TYPE);
// console.info('GIT_REF_NAME: ', import.meta.env.VITE_GIT_REF_NAME);
// console.info('GIT_SHA: ', import.meta.env.VITE_GIT_SHA);

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);

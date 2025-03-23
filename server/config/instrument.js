// // Import with `import * as Sentry from "@sentry/node"` if you are using ESM
// import * as Sentry from "@sentry/node"
// import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Sentry.init({
//     dsn: "https://ad260599d2d884fa18e4408b2d314cc4@o4509025300512768.ingest.us.sentry.io/4509025305755648",

//     integrations: [
//         nodeProfilingIntegration(),
//         Sentry.modulesIntegration()
//     ],
//     // Set sampling rate for profiling - this is evaluated only once per SDK.init
//     profileSessionSampleRate: 1.0,
// });

// Sentry.profiler.startProfiler();

// Sentry.startSpan({
//     name: "My First Transaction",
// }, () => {

// });

// Sentry.profiler.stopProfiler();


// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
    dsn: "https://ad260599d2d884fa18e4408b2d314cc4@o4509025300512768.ingest.us.sentry.io/4509025305755648",

    integrations: [
        Sentry.modulesIntegration()
    ],
    // Set sampling rate for profiling - this is evaluated only once per SDK.init
    profileSessionSampleRate: 1.0,
});
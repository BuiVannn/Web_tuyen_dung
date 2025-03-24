import './config/instrument.js'

import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'

import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'

// initalize express

const app = express()

// Connect to databse

await connectDB()
// Middlewares

app.use(cors())
// fix
// app.use(cors({
// origin: "https://web-tuyen-dung-server.vercel.app",
// methods: "GET,POST,PUT,DELETE",
// credentials: true
// }));

app.use(express.json())

// fix bug
// app.use((req, res, next) => {
// console.log(`Incoming Request: ${req.method} ${req.url}`);
// next();
// });


// routes
app.get('/', (req, res) => res.send("API Working"))

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});

//app.post('/webhooks', clerkWebhooks)
app.post('/webhooks', express.raw({ type: "application/json" }), clerkWebhooks);
// Port

const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

})
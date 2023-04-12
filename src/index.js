import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css'
import App from './App';
import {BrowserRouter} from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import * as Sentry from "@sentry/react";
import {BrowserTracing} from "@sentry/tracing";
import {SENTRY_DSN} from "./rummikub/constants";

if (process.env.NODE_ENV === 'development') {
    console.debug = console.log = console.warn = console.error = () => {
    };
}

Sentry.init({
    dsn: SENTRY_DSN, integrations: [new BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<BrowserRouter>
    <App/>
</BrowserRouter>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.debug))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

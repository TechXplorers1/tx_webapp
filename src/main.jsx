import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import './index.css'
import './App.css';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';

// NOTE: ContactForm was imported here but never rendered — removed to save bundle size.
// If needed, it is already lazy-loaded via the /services/job-contact-form route in App.jsx.

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
)
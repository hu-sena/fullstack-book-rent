import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// publishable key
const stripePromise = loadStripe('pk_test_51OYRJRFadWtcUXSTtrpbKLfC4WTvcBSUnZSNR10x4xbLfUPAQlDI2XMVcXsBNWg96jDx8UA5NwuAHYIInDR77rvX00t73xYjkG');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </BrowserRouter>
);

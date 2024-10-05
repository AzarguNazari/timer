import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TimerComponent from './time-component/App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <TimerComponent />
  </React.StrictMode>
);

serviceWorkerRegistration.unregister();

reportWebVitals();

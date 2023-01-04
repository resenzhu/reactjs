import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import App from './app';
import {createRoot} from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production')
{
  /* eslint-disable */

  console.log = () => {};
  console.trace = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.error = () => {};

  /* eslint-enable */
}

const root = createRoot
(
  document.getElementById('root') as HTMLElement
);

root.render(<App />);

serviceWorkerRegistration.register();

if (process.env.NODE_ENV !== 'production')
{
  reportWebVitals(console.log);   // eslint-disable-line
}

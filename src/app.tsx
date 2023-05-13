import './react-i18next';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'normalize.css/normalize.css';
import {StrictMode, Suspense} from 'react';
import {BrowserRouter} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {App as Layout} from './layouts';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import Routes from './routes';
import {config} from '@fortawesome/fontawesome-svg-core';
import persistor from './redux/persistor';
import store from './redux/store';

const App = (): JSX.Element =>
{
  config.autoAddCss = false;

  return (
    <StrictMode>
      <Suspense>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <BrowserRouter>
              <HelmetProvider>
                <Layout>
                  <Routes />
                </Layout>
              </HelmetProvider>
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </Suspense>
    </StrictMode>
  );
};

export default App;

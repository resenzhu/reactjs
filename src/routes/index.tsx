import {Navigate, Routes as ReactRoutes, Route} from 'react-router-dom';
import {Home} from './../pages/main';

const Routes = (): JSX.Element =>
(
  <ReactRoutes>
    <Route path='/' element={<Home />} />
    <Route path='*' element={<Navigate to='/' />} />
  </ReactRoutes>
);

export default Routes;

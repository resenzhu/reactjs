import {Navigate, Routes as ReactRoutes, Route} from 'react-router-dom';
import {Home as MainHome} from './../pages/main';
import {Main as MainLayout} from './../layouts';

const Routes = (): JSX.Element =>
(
  <ReactRoutes>
    <Route
      path='/'
      element={<MainLayout><MainHome /></MainLayout>}
    />
    <Route
      path='*'
      element={<Navigate to='/' />}
    />
  </ReactRoutes>
);

export default Routes;

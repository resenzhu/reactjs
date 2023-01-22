import {Jigsaw, TheLounge} from './../pages/projects';
import {Navigate, Routes as ReactRoutes, Route} from 'react-router-dom';
import {Home} from './../pages/main';

const Routes = (): JSX.Element =>
(
  <ReactRoutes>
    <Route path='/' element={<Home />} />
    <Route path='/project/jigsaw' element={<Jigsaw />} />
    <Route path='/project/the-lounge' element={<TheLounge />} />
    <Route path='*' element={<Navigate to='/' />} />
  </ReactRoutes>
);

export default Routes;

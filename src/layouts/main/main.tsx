import Navbar from './navbar/navbar';
import {ReactNode} from 'react';

type Main =
{
  children: ReactNode
};

const Main = ({children}: Main): JSX.Element =>
(
  <>
    <Navbar />
    {children}
  </>
);

export default Main;

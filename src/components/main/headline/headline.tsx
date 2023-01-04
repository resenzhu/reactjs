import styles from './headline.module.scss';

type Headline =
{
  children: string
};

const Headline = ({children}: Headline): JSX.Element =>
(
  <div className={styles.headline}>
    {children}
  </div>
);

export default Headline;

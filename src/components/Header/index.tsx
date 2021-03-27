import { SingInButton } from '../SingInButton'

import styles from './styles.module.scss'

export function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <img src="/images/logo.svg" alt="ig.news" />

        <nav>
          <a href="" className={styles.headerLinkActive}>
            Home
          </a>
          <a href="">Posts</a>
        </nav>

        <SingInButton />
      </div>
    </header>
  )
}

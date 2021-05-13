import { useState } from 'react'
import { ActiveLink } from '../ActiveLink'
import { SingInButton } from '../SingInButton'

import styles from './styles.module.scss'

export function Header(): JSX.Element {
  const [openMenuMobile, setOpenMenuMobile] = useState(false)

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerWrapper}>
        <img src="/images/logo.svg" alt="ig.news" />

        <button
          onClick={() => setOpenMenuMobile(!openMenuMobile)}
          type="button"
          className={`${styles.burguer} ${
            openMenuMobile ? styles.burguerActive : ''
          }`}
        >
          <div />
        </button>

        <div
          className={`${styles.menuWrapper} ${
            openMenuMobile ? styles.menuActive : ''
          }`}
        >
          <nav>
            <ActiveLink href="/" activeClassName={styles.headerLinkActive}>
              <a>Home</a>
            </ActiveLink>
            <ActiveLink href="/posts" activeClassName={styles.headerLinkActive}>
              <a>Posts</a>
            </ActiveLink>
          </nav>

          <SingInButton className={styles.headerSingInButton} />
        </div>
      </div>
    </header>
  )
}

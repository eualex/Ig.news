import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './styles.module.scss'

interface SingInButtonProps {
  className?: string
}

export function SingInButton({ className }: SingInButtonProps): JSX.Element {
  const [session] = useSession()

  return session ? (
    <button
      type="button"
      className={`${styles.singInButton} ${className}`}
      onClick={() => signOut()}
    >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={`${styles.singInButton} ${className}`}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#eba417" />
      Sing in with Github
    </button>
  )
}

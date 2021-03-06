import { cloneElement, ReactElement } from 'react'
import { useRouter } from 'next/router'
import Link, { LinkProps } from 'next/link'

interface ActiveLinkProps extends LinkProps {
  children?: ReactElement
  activeClassName: string
}

export function ActiveLink({
  activeClassName,
  children,
  ...rest
}: ActiveLinkProps): JSX.Element {
  const { asPath } = useRouter()
  const paths = asPath.split('/')

  let className: string

  if (paths[1]) {
    className = `/${paths[1]}` === rest.href ? activeClassName : ''
  } else {
    className = asPath === rest.href ? activeClassName : ''
  }

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}

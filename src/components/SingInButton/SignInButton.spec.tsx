import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import { SingInButton } from '.'

jest.mock('next-auth/client')

describe('SignIn Button component', () => {
  it('renders correctly when user is not authenticaded', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SingInButton />)

    expect(screen.getByText('Sing in with Github')).toBeInTheDocument()
  })

  it('renders correctly when user is authenticaded', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: 'John Doe', email: 'jonh.doe@test.com' },
        expires: 'fake-expires'
      },
      false
    ])

    render(<SingInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})

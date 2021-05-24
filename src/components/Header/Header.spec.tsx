import { render, screen } from '@testing-library/react'
import { Header } from '.'

jest.mock('next/router', () => {
  return {
    useRouter: () => ({
      asPath: '/'
    })
  }
})

jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})

describe('Header component', () => {
  it('renders correctly', () => {
    render(<Header />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Posts')).toBeInTheDocument()
  })
})

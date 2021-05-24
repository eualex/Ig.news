import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import Home, { getStaticProps } from '../../pages'
import { stripe } from '../../services/stripe'

jest.mock('next/router')

jest.mock('next-auth/client', () => ({
  useSession: () => [null, false]
}))

jest.mock('../../services/stripe')

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ amount: '$10', priceId: 'fake-price-id' }} />)

    expect(screen.getByText('for $10 month')).toBeInTheDocument()
  })

  it('loads inicial data', async () => {
    const retrievePricesStripeMocked = mocked(stripe.prices.retrieve)

    retrievePricesStripeMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})

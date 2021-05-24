import { render, screen } from '@testing-library/react'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import Post, { getServerSideProps } from '../../pages/posts/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

jest.mock('next-auth/client')

const post = {
  slug: 'fake-slug',
  title: 'fake-title',
  content: '<p>fake-content</p>',
  updatedAt: '10 de Abril'
}

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('fake-title')).toBeInTheDocument()
  })

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'fake-slug'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )
  })

  it('loads inicial data when user is authenticated', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicClientMocked = mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'fake-title' }],
          content: [{ type: 'paragraph', text: 'fake-content' }]
        },
        last_publication_date: '05-24-2021'
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'fake-prismic-id'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-prismic-id',
            title: 'fake-title',
            content: '<p>fake-content</p>',
            updatedAt: '24 de maio de 2021'
          }
        }
      })
    )
  })
})

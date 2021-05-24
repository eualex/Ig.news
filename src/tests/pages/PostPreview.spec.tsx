import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { mocked } from 'ts-jest/utils'

import PostPreview, {
  getStaticProps,
  getStaticPaths
} from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

jest.mock('next/router')
jest.mock('next-auth/client')
jest.mock('../../services/prismic')

const post = {
  slug: 'fake-slug',
  title: 'fake-title',
  content: '<p>fake-content</p>',
  updatedAt: '10 de Abril'
}

describe('PostPreview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)

    useRouterMocked.mockReturnValueOnce({
      push: jest.fn()
    } as any)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<PostPreview post={post} />)

    expect(screen.getByText('fake-title')).toBeInTheDocument()
    expect(screen.getByText('Subscribe now 🤗')).toBeInTheDocument()
  })

  it('redirects user to full post when subscription is found', () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)

    const pushMocked = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: 'fake-active-subscription'
      },
      false
    ])

    render(<PostPreview post={post} />)

    expect(pushMocked).toHaveBeenCalledWith(`/posts/${post.slug}`)
  })

  it('should return fallback with blocking and empty paths in getStaticPaths', async () => {
    const response = await getStaticPaths({})

    expect(response).toEqual({
      paths: [],
      fallback: 'blocking'
    })
  })

  it('loads inicial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'fake-title' }],
          content: [{ type: 'paragraph', text: 'fake-content' }]
        },
        last_publication_date: '05-24-2021'
      })
    } as any)

    const response = await getStaticProps({
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

import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import Posts, { getStaticProps } from '../../pages/posts'
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic')

const posts = [
  {
    slug: 'fake-slug',
    title: 'fake-title',
    excerpt: 'Fake excerpt',
    updatedAt: '10 de Abril'
  }
]

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('fake-title')).toBeInTheDocument()
  })

  it('loads inicial data', async () => {
    const prismicQueryMocked = mocked(getPrismicClient)

    prismicQueryMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-prismic-id',
            data: {
              title: [{ type: 'heading', text: 'fake-title' }],
              content: [{ type: 'paragraph', text: 'fake-content' }]
            },
            last_publication_date: '05-24-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'fake-prismic-id',
              title: 'fake-title',
              excerpt: 'fake-content',
              updatedAt: '24 de maio de 2021'
            }
          ]
        }
      })
    )
  })
})

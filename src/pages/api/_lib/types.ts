import { NextApiRequest, NextApiResponse } from 'next'

export type NextApiRoute = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>

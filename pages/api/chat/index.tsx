import type { NextApiRequest, NextApiResponse } from 'next'
import type { Chat } from '../../../interfaces'
import { api } from '../../../interfaces/api'


export default async function chatHandler(
  req: NextApiRequest,
  res: NextApiResponse<Chat[] | Chat>
) {
  const { query, method, body } = req
  const id = query.id as string
  const endpointURL = "/chat";

  switch (method) {
    case 'GET':
      const getResp = await api.get<Chat[]>(endpointURL)
      return res.status(200).json(getResp.data)
    case 'POST':
      const postResp = await api.post<Chat>(endpointURL, body )
      return res.status(200).json(postResp.data)
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Message } from '../../../../interfaces'
import { api } from '../../../../interfaces/api'

// url: api/chat/message/[id]
export default async function messageHandler(
    req: NextApiRequest,
    res: NextApiResponse<Message>
) {
    const { query, method, body } = req
    const id = query.id as string
    const endpointURL = `/chat/${id}/message`;

    switch (method) {
        case 'POST':
            const postResp = await api.post<Message>(endpointURL, body)
            return res.status(200).json(postResp.data)
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

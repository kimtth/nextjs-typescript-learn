import type { NextApiRequest, NextApiResponse } from 'next'
import type { Chat } from '../../../interfaces'
import { api } from '../../../interfaces/api'

// url: api/chat/[id]
export default async function chatHandler(
    req: NextApiRequest,
    res: NextApiResponse<Chat>
) {
    const { query, method, body } = req
    const id = query.id as string;
    const endpointURL = "/chat";

    switch (method) {
        case 'GET':
            const getResp = await api.get<Chat>(`${endpointURL}/${id}`)
            return res.status(200).json(getResp.data)
        case 'PUT':
            // Update chat name
            const putResp = await api.put<Chat>(`${endpointURL}/${id}`, body)
            return res.status(200).json(putResp.data)
        case 'POST':
            const postResp = await api.post<Chat>(`${endpointURL}/${id}`, body)
            return res.status(200).json(postResp.data)
        case 'DELETE':
            const deleteResp = await api.delete<Chat>(`${endpointURL}/${id}`)
            return res.status(200).json(deleteResp.data)
        default:
            res.setHeader('Allow', ['GET', 'DELETE', 'POST', 'PUT'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}


// You still need to use fetch or axios even if you use useSWR, to provide a fetcher function. useSWR most importantly provides caching for your data.
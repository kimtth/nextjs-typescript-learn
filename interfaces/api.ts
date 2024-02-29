import axios from "axios";
import { Chat, Message } from ".";


export const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5000",
    withCredentials: false
});


export const chatAllfetcher = (url: string) => api.get(url).then(res => res.data).catch(error => console.log(error))

export const chatCreate = (newChat: Chat) => api.post('/api/chat', newChat).then(res => res.data).catch(error => console.log(error))

export const chatGetById = (chat_id: string) => api.get(`/api/chat/${chat_id}`).then(res => res.data).catch(error => console.log(error))

export const chatGetMsgs = (chat_id: string) => api.get(`/api/chat/${chat_id}/message`).then(res => res.data).catch(error => console.log(error))

export const chatUpdateById = (chat_id: string, newChat: Chat) => api.put(`/api/chat/${chat_id}`, newChat).then(res => res.data).catch(error => console.log(error))

export const chatDeleteById = (chat_id: string) => api.delete(`/api/chat/${chat_id}`).then(res => res.data).catch(error => console.log(error))

export const chatAddMsg = (chat_id: string, addmsg: Message) => api.post(`/api/chat/${chat_id}/message`, addmsg).then(res => res.data).catch(error => console.log(error))

export const chatGetResponse = (chat_id: string, msg: string, mode: string) => api.post(`/api/chat/response`, { 'chat_id': chat_id, 'msg': msg, 'mode': mode }).then(res => res.data).catch(error => console.log(error))

// export const chatAllfetcher = (url: string) => {
//     // Mockup response JSON
//     const mockResponse = {
//         // Add your mock data here
//     };

//     return Promise.resolve(mockResponse);
// };

import axios from "axios";
import { Chat, Message } from ".";


export const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL || "http://127.0.0.1:5000",
    withCredentials: false
});


export const chatAllfetcher = (url: string) => axios.get(url).then(res => res.data).catch(error => console.log(error))

export const chatCreate = (newChat: Chat) => axios.post('/api/chat', newChat).then(res => res.data).catch(error => console.log(error))

export const chatGetById = (chat_id: number) => axios.get(`/api/chat/${chat_id}`).then(res => res.data).catch(error => console.log(error))

export const chatUpdateById = (chat_id: number, newChat: Chat) => axios.put(`/api/chat/${chat_id}`, newChat).then(res => res.data).catch(error => console.log(error))

export const chatDeleteById = (chat_id: number) => axios.delete(`/api/chat/${chat_id}`).then(res => res.data).catch(error => console.log(error))

export const chatAddMsg = (chat_id: number, addmsg: Message) => axios.post(`/api/chat/message/${chat_id}`, addmsg).then(res => res.data).catch(error => console.log(error))

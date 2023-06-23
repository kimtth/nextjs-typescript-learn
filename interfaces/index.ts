export type User = {
    id: number
    name?: string
}

export type Chat = {
    id: number
    name: string
    messages?: Message[]
}

export type Message = {
    chat_id: number
    id: number
    fromWho?: string
    text?: string
}
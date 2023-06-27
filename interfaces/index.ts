export type User = {
    id: number
    name?: string
}

export type Chat = {
    id: number
    name: string
    messages?: Message[]
    created_at?: Date
    updated_at?: Date
}

export type Message = {
    chat_id: number
    id: number
    fromWho?: string
    text?: string
    created_at?: Date
    updated_at?: Date
}
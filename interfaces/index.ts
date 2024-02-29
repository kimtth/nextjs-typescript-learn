export type User = {
    id: string
    name?: string
}

export type Chat = {
    id: string
    name: string
    prompt?: string
    messages?: Message[]
    created_at?: Date
    updated_at?: Date
}

export type Message = {
    chat_id: string
    id: string
    from_who?: string
    msg?: string
    created_at?: Date
    updated_at?: Date
}
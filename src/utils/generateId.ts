import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('123456789abcdef', 8)

export const generateId = () => nanoid()

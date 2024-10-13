import {z} from 'zod'


export const verifySchema=z.object({
  code:z.string().length(6,'Verifications must be of Six digit')
})
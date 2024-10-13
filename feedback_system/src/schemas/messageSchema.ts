import {z} from 'zod'


export const acceptMessages=z.object({
  content:z
  .string()
  .min(10,{message:'content must content atleat 10 character'})
  .max(400,{message:'content must not content more than 400 character'})
})
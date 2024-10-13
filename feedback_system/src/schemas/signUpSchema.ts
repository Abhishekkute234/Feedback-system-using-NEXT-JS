import {z} from 'zod'
// one object
export const usernameValidation=z
.string()
.min(2,"Username is at  least 2 characters long")
.max(20,"Username must not more than  20 characters long")
.regex(/^[a-zA-Z0-9_-]+$/
,"Username must contain special chnarater ")


// many objects
export const signUpSchema =z.object({
  username:usernameValidation,
  email:z.string().email("Invalid email"),
  password:z.string().min(6,{message:"password must be atleast  6 characters long"})


})
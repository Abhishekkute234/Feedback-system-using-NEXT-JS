import{resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username:string,
  verifyCode:string
) :Promise<ApiResponse>{
  try {
    await resend.emails.send({
      from: 'kuteabhishek2004@gmail.com',
      to: ['email'],
      subject: 'Abhishek Kute Verification Code',
      react: VerificationEmail({username,otp:verifyCode}),
    });
   
    return {success:true,message:" verification email send succesfully"}

  }
  catch(emailError){
    console.log("Error sending verification email",emailError)
    return {success:false,message:"Failed to send verification email"}
  }
}
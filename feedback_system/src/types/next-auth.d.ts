import NextAuth, { DefaultSession } from "next-auth";
import { DefaultColors } from "tailwindcss/types/generated/colors";

declare module 'next-auth'{
  interface User{
    _id?:string;
    isVerified?:boolean;
    isacceptngMessages?:boolean;
    username?: string

  }

  interface Session {
    user: {
      _id?: string; // Optional user ID
      isVerified?: boolean; // Optional verification status
      isAcceptingMessages?: boolean; // Optional status to check if the user is accepting messages
      username?: string; // Optional username field
    } & DefaultSession["user"]; // Extend from DefaultSession's user object
  }
}
// declare module'next-auth/jwt'{
//   interface JWT{

//   }
// }
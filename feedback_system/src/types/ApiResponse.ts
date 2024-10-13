import { Message } from "@/app/models/User"; // Ensure this path is correct

export  interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Message[]; // Use Message[] for an array of Message objects
}



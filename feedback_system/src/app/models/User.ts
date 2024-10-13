import mongoose, { Schema, Document } from "mongoose";

// Message Schema
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // Use Date.now for the default timestamp
  },
});

// User Schema
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date; // Corrected typo from "verifyCodeExpery"
  isVerified:boolean;
  isAcceptingMessage: boolean;
  messages: Message[]; // Array of Message references
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "Please use a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message', // Reference to the Message schema
  }],
});

// Create the Message and User models
const MessageModel = mongoose.model<Message>("Message", MessageSchema);
const UserModel = mongoose.model<User>("User", UserSchema);

// Export both models, without default exports
export { MessageModel, UserModel };

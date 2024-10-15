import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect"; // Custom function to connect to the database
import { UserModel } from "@/app/models/User"; // User model schema

// Configuration options for NextAuth
export const authOptions: NextAuthOptions = {
  // Array of authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials", // Unique identifier for the credentials provider
      name: "Credentials", // Display name of the provider
      credentials: {
        email: { label: "Email", type: "text" }, // User input field for email
        password: { label: "Password", type: "password" }, // User input field for password
      },
      // Function to authorize users with credentials
      async authorize(credentials: any): Promise<any> {
        await dbConnect(); // Connect to the database

        try {
          // Find a user by either email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email }, // Search by email
              { username: credentials.email }, // Search by username (if provided)
            ],
          });

          // If user is not found, throw an error
          if (!user) {
            throw new Error("No user found with the provided credentials.");
          }

          // Check if the account is verified
          if (!user.isVerified) {
            throw new Error("Please verify your account."); // Error if account is not verified
          }

          // Check if the provided password matches the stored hashed password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // If the password is incorrect, throw an error
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password.");
          }

          // Return the user object if credentials are valid
          return user;
        } catch (err: any) {
          // Catch and throw any errors that occur during the process
          throw new Error(err.message || "An error occurred during login.");
        }
      },
    }),
  ],

  // Callbacks to control session and JWT token
  callbacks: {
    // Session callback to update the session object with token information
    async session({ session, token }) {
      if (token) {
        // Attach the custom properties to the session's user object
        session.user._id = token._id; // User ID
        session.user.isVerified = token.isVerified; // Verification status
        session.user.isAcceptingMessages = token.isAcceptingMessages; // Message acceptance status
        session.user.username = token.username; // Username
      }
      return session; // Return the updated session object
    },

    // JWT callback to store user information in the token
    async jwt({ token, user }) {
      if (user) {
        // Store the user data in the token from the `user` object
        token._id = user._id?.toString(); // User ID as string
        token.isVerified = user.isVerified; // Verification status
        token.isAcceptingMessages = user.isAcceptingMessages; // Message acceptance status
        token.username = user.username; // Username
      }
      return token; // Return the updated token
    },
  },

  // Custom pages configuration
  pages: {
    signIn: "/sign-in", // Custom sign-in page
    signOut: "/sign-out", // Custom sign-out page (optional)
    error: "/auth/error", // Error page for authentication issues
    verifyRequest: "/auth/verify-request", // Verification email sent page
    newUser: "/auth/new-user", // Redirect to the new user page after sign up
  },

  // Session strategy
  session: {
    strategy: "jwt", // Use JWT to handle sessions
  },

  // Secret for JWT token encryption
  secret: process.env.NEXTAUTH_SECRET,

  // Define callback URLs for authentication events
  // Redirect after sign-in and sign-out
  redirect: async (url, baseUrl) => {
    // Redirect to the dashboard after sign-in or the home page for sign-out
    if (url === '/sign-in' || url === '/dashboard') {
      return Promise.resolve(`${baseUrl}/dashboard`);
    }
    return Promise.resolve(baseUrl);
  },
};

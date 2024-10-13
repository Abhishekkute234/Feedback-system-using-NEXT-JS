import dbConnect from '@/lib/dbConnect'; // Import the function to establish a database connection
import { UserModel } from '@/app/models/User'; // Import the user model for MongoDB interactions
import bcrypt from 'bcryptjs'; // Import bcrypt for hashing passwords
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'; // Import the function to send verification emails

// Define the POST request handler function for user registration
export async function POST(request: Request) {
  // Establish connection to the database
  await dbConnect();

  try {
    // Extract username, email, and password from the request body
    const { username, email, password } = await request.json();

    // Check if a verified user already exists with the same username
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true, // Only check for verified users
    });

    // If the username is taken by a verified user, return an error response
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 } // Return a 400 Bad Request status
      );
    }

    // Check if a user with the provided email already exists
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate a random 6-digit verification code
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If the user exists with the given email
    if (existingUserByEmail) {
      // If the user is already verified, return an error
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
        // If the user is not verified, update the password and verification code
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Set verification code expiry to 1 hour from now
        await existingUserByEmail.save(); // Save the updated user
      }
    } else {
      // If the email is not associated with any user, create a new user
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1); // Set verification code expiry to 1 hour

      // Create a new user document with the provided data
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode, // Set the generated verification code
        verifyCodeExpiry: expiryDate, // Set expiry for the verification code
        isVerified: false, // User is not verified yet
        isAcceptingMessages: true, // User can accept messages (optional)
        messages: [], // Initialize an empty messages array
      });

      // Save the new user to the database
      await newUser.save();
    }

    // Send a verification email to the user with the verification code
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // If sending the email fails, return an error response
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 } // Return a 500 Internal Server Error status
      );
    }

    // If everything is successful, return a success response
    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 } // Return a 201 Created status
    );
  } catch (error) {
    // If an error occurs, log it and return an error response
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 } // Return a 500 Internal Server Error status
    );
  }
}

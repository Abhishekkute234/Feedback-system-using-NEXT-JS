# NEXT-.JS
# Feedback System Using Next.js

## Table of Contents
1. [Project Setup](#project-setup)
2. [Folder Structure](#folder-structure)
3. [Schema Creation](#schema-creation)
4. [Zod Integration](#zod-integration)
5. [Environment Variables](#environment-variables)
6. [Database Connection](#database-connection)
7. [Images of Packages](#images-of-packages)

## Project Setup

### Step 1: Create a Next.js Application
Run the following command in your terminal to start a new Next.js project:
```bash
npx create-next-app@latest
√ What is your project named? ... feedback_system
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like to use `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to customize the default import alias (@/*)? ... No / Yes
npm i
npm run dev
npm i mongoose


 Unique Email Validation
To get a regex for unique email addresses, visit regexr.com and use the community pattern. Use the following in your schema:

email: {
  type: String,
  required: true,
  unique: true,
  match: [
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
    "Please use a valid email address",
  ],
},

npm i zod

 Create Environment Files
Create an .env file and an .env.sample file.
In your .env file, add the following line:

MONGODB_URI=""


Database connection

import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectToDatabase;

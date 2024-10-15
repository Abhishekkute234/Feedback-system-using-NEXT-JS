'use client'; // This indicates that the component is a client-side component

import { useSession, signIn, signOut } from "next-auth/react"; // Import necessary functions from next-auth

export default function Component() {
  // useSession hook retrieves session data, including user information if the user is signed in
  const { data: session } = useSession();

  // If the user is signed in (session exists)
  if (session) {
    return (
      <>
        {/* Display user's email if they are signed in */}
        Signed in as {session.user.email} <br />
        {/* Button to allow the user to sign out */}
        <button  className="bg-orange-500"  onClick={() => signOut()}>Sign out</button>
      </>
    );
  }

  // If the user is not signed in (no session)
  return (
    <>
      Not signed in <br />
      {/* Button to trigger the sign-in process */}
      <button  className="bg-orange-500 px-3 py-2" onClick={() => signIn()}>Sign in</button>
    </>
  );
}

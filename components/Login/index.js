"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
export default function LoginButton() {
  const { data: session } = useSession();
  console.log("Session:", session);
  if (session) {
    return (
      <>
        UserID is {session.token.sub} <br />
        <img
          src={session.userImage}
          alt="User's profile picture"
          width={100}
          height={100}
        />
        <br />
        {/* other content */}
        <button
          onClick={() => signOut()}
          type="button"
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          Sign Out
        </button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      {/* <button onClick={() => signIn()}>Sign in</button> */}
      <button
        onClick={() =>
          signIn("twitter", { callbackUrl: "http://localhost:3000" })
        }
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Sign In
      </button>
    </>
  );
}

import { useSession, signIn, signOut } from "next-auth/react";
import Nav from "@/components/Nav";
import { useState } from "react";

export default function Layout({ children, pageName }) {
  const { data: session } = useSession();
  const [openNav, setopenNav] = useState(false);
  if (session) {
    return (
      <div className="min-h-screen flex flex-row sm:flex-col">
        <div className="flex pt-5 pl-5 mb-5 hidden sm:flex">
          <button
            className="text-black"
            onClick={() => setopenNav((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </button>
          <div className="grow flex justify-center mr-8">{pageName}</div>
        </div>
        <Nav openNav={openNav} setopenNav={setopenNav} />
        <div className="flex-grow bg-white p-2 flex flex-col items-start">
          {children}
          {/* Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button> */}
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="bg-blue-800 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <div>Not signed in </div>
          <button
            onClick={async () => await signIn("google")}
            className="bg-white p-2 rounded-lg"
          >
            Login with google
          </button>
        </div>
      </div>
    </>
  );
}

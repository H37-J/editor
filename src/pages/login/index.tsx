// pages/index.js
import useAuth from '@/hooks/useAuth';
import { FcGoogle } from "react-icons/fc";
import { FaGithubAlt } from "react-icons/fa";
import {  signIn } from "next-auth/react";
import { useRouter } from 'next/router';
const LoginPage = () =>  {
  const { session } = useAuth();
  const { push } = useRouter();
  if (session) {
    push("/").catch(console.error);
  }
  if (session) {
    return null;
  }
  return (
    <div className="background-gradient bg-black flex flex-1 justify-center items-center">
      <div className="flex flex-col space-y-4">
        <button onClick={() => signIn('google', { callbackUrl : '/'})} className="flex items-center px-24 py-8 bg-white text-black rounded space-x-3 text-xl font-bold">
          <FcGoogle className="mt-1"/>
          <span>Sign in with Google</span>
        </button>
        <button onClick={() => signIn('github')} className="flex items-center px-24 py-8 bg-gray-800 text-white rounded space-x-3 text-xl font-bold">
          <FaGithubAlt className="mt-1"/>
          <span>Sign in with GitHub</span>
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
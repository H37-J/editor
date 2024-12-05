// pages/index.js
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      {session ? (
        <>
          <p>환영합니다, {session.user.email}!</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </>
      ) : (
        <>
          <p>로그인 해주세요.</p>
          <button onClick={() => signIn("google")}>구글로 로그인</button>
        </>
      )}
    </div>
  );
}
import { useUser } from "@auth0/nextjs-auth0";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  if (user) router.replace("/today");

  return (
    <div className="">
      <Head>
        <title>finishtodo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1>landing page</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/login">Login</a>
      </main>
    </div>
  );
};

export default Home;

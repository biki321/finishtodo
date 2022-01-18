import { useUser } from "@auth0/nextjs-auth0";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";
import illus from "../public/svg/online_organizer_re_156n.svg";
import pruductPng from "../public/imgs/productScreenShot.png";
import loadingSpinner from "../public/svg/Spinner-1s-200px.svg";
import Error from "../components/Error";
import LoadingSpinner from "../components/LoadingSpinner";

const Home: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  if (isLoading) return <LoadingSpinner />;
  if (user) {
    router.replace("/today");
    return <div></div>;
  }

  if (error) return <Error msg="Error while Loading" emoji="😥" />;
  return (
    <div className="max-w-7xl p-2">
      <Head>
        <title>finishtodo</title>
        <meta name="description" content="productivity app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center mt-6">
        <div
          className="flex flex-col justify-center items-center
         text-4xl font-extrabold mb-7"
        >
          <h1>Organize your Life</h1>
          <h1>With Finishtodo</h1>
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/auth/login"
          className="py-1 bg-emerald-600 text-white
         rounded-md w-28 flex justify-center items-center font-semibold
          mb-10"
        >
          Get Started
        </a>

        <div className="mb-4">
          <Image
            src={illus}
            width={1000}
            height={500}
            alt="organize your life illustration"
          />
        </div>
        <div className="max-w-2xl shadow-2xl  top-96">
          <Image
            src={pruductPng}
            // width={1000}
            // height={800}
            layout="intrinsic"
            alt="organize your life illustration"
          />
        </div>
      </main>
    </div>
  );
};

export default Home;

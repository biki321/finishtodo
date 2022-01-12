import { useUser, UserProfile } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { ReactElement, ReactNode, useEffect } from "react";
import Layout from "../../components/Layout";
import { placeholderPersonImg } from "../../placeholderImgs";
import NextPageWithLayout from "../../types/NextPageWithLayout ";

const Profile: NextPageWithLayout = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error.message}</div>;
  if (!user) {
    router.replace("/");
    return <div></div>;
  }

  return (
    <div>
      <Image
        width={100}
        height={100}
        src={user!.picture ?? placeholderPersonImg}
        alt="profile picture"
      />
      <h2>{user!.name}</h2>
      <p>{user!.email}</p>
    </div>
  );
};

Profile.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Profile;

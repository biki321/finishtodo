import { useUser, UserProfile } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { useEffect } from "react";
import { placeholderPersonImg } from "../placeholderImgs";

export default function Profile() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    console.log("profile profile.tsx", user);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error.message}</div>;

  return (
    user && (
      <div>
        <Image
          width={100}
          height={100}
          src={user.picture ?? placeholderPersonImg}
          alt="profile picture"
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}

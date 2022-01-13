import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { NextPage } from "next/types";

const Project: NextPage = () => {
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const { projectId } = router.query;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error.message}</div>;
  if (!user) {
    router.replace("/");
    return <div></div>;
  }

  return <div>{projectId}</div>;
};

export default Project;

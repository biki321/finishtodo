import { handleAuth, handleCallback, Session } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next/types";
import { prisma } from "../../../lib/prisma";

const afterCallback = async (
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session,
  state: { [key: string]: any }
) => {
  console.log("session at aftercallback", session);
  try {
    //create user if does not exist
    //session.user.sub is the user_id
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.sub,
      },
    });
    console.log("user at aftercallback", user);
    if (!user) {
      const createdUser = await prisma.user.create({
        data: {
          id: session.user.sub,
          name: session.user.nickname,
          //weirdly auth0 return email as name(username is not required for signup)
          email: session.user.name,
        },
      });
      // create default project index
      const project = await prisma.project.create({
        data: {
          name: "Inbox",
          // User: { connect: { id: createdUser.id } },
          userId: createdUser.id,
          isIndex: true,
        },
      });
      console.log("indx proj", project);
    }
  } catch (error) {
    console.error(error);
  }
  return session;
};

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback });
    } catch (error) {
      //error.status || 500 should be used
      res.status(500).end("server problem");
    }
  },
});

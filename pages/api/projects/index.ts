// /api/projects/

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { prisma } from "../../../lib/prisma";
import type { NextApiResponse } from "next";
import { Project } from "@prisma/client";

type ResponseData = {
  data: Project[] | Project;
};

type ErrorData = {
  status: number;
  error: string;
};

export default withApiAuthRequired(async function handler(
  req,
  res: NextApiResponse<ResponseData | ErrorData>
) {
  const session = getSession(req, res);
  const userId = session!.user.sub as string;

  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        where: { userId: userId },
      });
      res.status(200).json({ data: projects });
    } catch (error) {
      res.status(500).json({ status: 500, error: "server problem" });
    }
  } else if (req.method === "POST") {
    try {
      const project = await prisma.project.create({
        data: {
          name: req.body.name,
          isFav: req.body.isFav,
          userId: userId,
          isIndex: req.body.isIndex,
        },
      });
      res.status(201).json({ data: project });
    } catch (error) {
      res.status(500).json({ status: 500, error: "server problem" });
    }
  }
});

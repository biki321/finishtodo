// /api/projects/:projectId/

import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiResponse } from "next/types";
import { prisma } from "../../../../lib/prisma";

function handleError(error: unknown, res: NextApiResponse) {
  if (error instanceof Error)
    if (error.message.includes("RecordNotFound"))
      res.status(404).json({ status: 404, error: "record not found" });

  res.status(500).json({ status: 500, error: "server problem" });
}

export default withApiAuthRequired(async function handler(req, res) {
  let { projectId } = req.query;
  projectId = typeof projectId === "object" ? projectId[0] : projectId;

  try {
    if (req.method === "GET") {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      res.status(200).json({ data: project });
    } else if (req.method === "PATCH") {
      const project = await prisma.project.update({
        data: { ...req.body },
        where: { id: projectId },
      });
      res.status(200).json({ data: project });
    } else if (req.method === "DELETE") {
      await prisma.project.delete({ where: { id: projectId } });
      res.status(203).end();
    }
  } catch (error) {
    handleError(error, res);
  }
});

// /api/projects/:projectId/todos/:todoId/comments/

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextApiResponse } from "next";
import { prisma } from "../../../../../../../lib/prisma";

function handleError(error: unknown, res: NextApiResponse) {
  if (error instanceof Error)
    if (error.message.includes("RecordNotFound"))
      res.status(404).json({ status: 404, error: "record not found" });

  res.status(500).json({ status: 500, error: "server problem" });
}

export default withApiAuthRequired(async function handler(req, res) {
  let { projectId, todoId } = req.query;
  projectId = typeof projectId === "object" ? projectId[0] : projectId;
  todoId = typeof todoId === "object" ? todoId[0] : todoId;

  try {
    if (req.method === "GET") {
      const comments = await prisma.comment.findMany({
        where: { todoId: todoId },
      });
      res.status(200).json({ data: comments });
    } else if (req.method === "POST") {
      const comment = await prisma.comment.create({
        data: { text: req.body.text, todoId: todoId },
      });
      await prisma.todo.update({
        data: { noOfComments: { increment: 1 } },
        where: { id: todoId },
      });
      res.status(200).json({ data: comment });
    }
  } catch (error) {
    handleError(error, res);
  }
});

// /api/projects/:projectId/todos/:todoId/comments/:commentId

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
  let { projectId, todoId, commentId } = req.query;
  projectId = typeof projectId === "object" ? projectId[0] : projectId;
  todoId = typeof todoId === "object" ? todoId[0] : todoId;
  commentId = typeof commentId === "object" ? commentId[0] : commentId;

  try {
    if (req.method === "PATCH") {
      const comment = await prisma.comment.update({
        data: { ...req.body },
        where: {
          id: commentId,
        },
      });
      res.status(200).json({ data: comment });
    } else if (req.method === "DELETE") {
      await prisma.comment.delete({ where: { id: commentId } });
      await prisma.todo.update({
        data: { noOfComments: { decrement: 1 } },
        where: { id: todoId },
      });
    }
    res.status(203).end();
  } catch (error) {
    handleError(error, res);
  }
});

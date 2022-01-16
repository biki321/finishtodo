// /api/projects/:projectId/todos/:todoId

import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Prisma } from "@prisma/client";
import { NextApiResponse } from "next";
import { prisma } from "../../../../../../lib/prisma";

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
    console.log("todo update", projectId, todoId, req.body);

    if (req.method === "PATCH") {
      const todo = await prisma.todo.update({
        data: { ...req.body },
        where: { id: todoId },
      });
      res.status(200).json({ data: todo });
    } else if (req.method === "DELETE") {
      await prisma.todo.delete({ where: { id: todoId } });
      await prisma.project.update({
        data: { noOfTodos: { decrement: 1 } },
        where: { id: projectId },
      });
      res.status(203).end();
    }
  } catch (error) {
    console.log("error at :todoId", error);
    handleError(error, res);
  }
});

// /api/projects/:projectId/todos/

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { prisma } from "../../../../../lib/prisma";

export default withApiAuthRequired(async function handler(req, res) {
  let { projectId } = req.query;
  projectId = typeof projectId === "object" ? projectId[0] : projectId;

  if (req.method === "GET") {
    try {
      const todos = await prisma.todo.findMany({
        where: { projectId: projectId },
      });
      res.status(200).json({ data: todos });
    } catch (error) {
      res.status(500).json({ status: 500, error: "server problem" });
    }
  } else if (req.method === "POST") {
    try {
      const todo = await prisma.todo.create({
        data: {
          name: req.body.name,
          description: req.body.description ?? null,
          dueDate: req.body.dueDate ?? null,
          projectId: projectId,
          priority: req.body.priority,
        },
      });
      // inc the noOfTodos in project entity
      await prisma.project.update({
        data: { noOfTodos: { increment: 1 } },
        where: { id: projectId },
      });
      res.status(201).json({ data: todo });
    } catch (error) {
      res.status(500).json({ status: 500, error: "server problem" });
    }
  }
});

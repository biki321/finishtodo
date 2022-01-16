// /api/todos/

import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { prisma } from "../../../lib/prisma";

export default withApiAuthRequired(async function handler(req, res) {
  const session = getSession(req, res);
  const userId = session!.user.sub as string;
  let { startDueDate, endDueDate } = req.query;
  startDueDate =
    typeof startDueDate === "object" ? startDueDate[0] : startDueDate;
  endDueDate = typeof endDueDate === "object" ? endDueDate[0] : endDueDate;
  if (req.method === "GET") {
    try {
      const projects = await prisma.project.findMany({
        where: { userId: userId },
      });
      const projectIds = projects.map((project) => project.id);
      const todos = await prisma.todo.findMany({
        where: {
          projectId: {
            in: projectIds,
          },
          isCompleted: false,
          dueDate: {
            gte: new Date(startDueDate),
            lte: new Date(endDueDate),
          },
        },
      });

      res.status(200).json({ data: todos });
    } catch (error) {
      console.log("error at get todos", error);
      res.status(500).json({ status: 500, error: "server problem" });
    }
  } else {
    res.status(500).json({ status: 405, error: "method not allowed" });
  }
});

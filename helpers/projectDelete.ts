import { Project } from "@prisma/client";
import { ScopedMutator } from "swr/dist/types";
const projectDelete = async (project: Project, mutate: ScopedMutator<any>) => {
  mutate(
    `/api/projects`,
    (data: { data: Project[] }) => {
      if (!data) return data;
      return { data: data.data.filter((ele) => ele.id !== project.id) };
    },
    false
  );

  const response = await fetch(`/api/projects/${project.id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    mutate(
      `/api/projects/${project.id}/todos`,
      (data: { data: Project[] }) => {
        if (!data) return data;
        return { data: [...data.data, project] };
      },
      false
    );
  }
  mutate(`/api/projects/${project.id}/todos`);
};

export default projectDelete;

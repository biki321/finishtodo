import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import Layout from "../../components/Layout";
import Todo from "../../components/Todo";
import useProjectLists from "../../hooks/useProjectLists";
import useTodos from "../../hooks/useTodos";
import NextPageWithLayout from "../../types/NextPageWithLayout ";
import { PlusIcon } from "@heroicons/react/outline";
import AddTodo from "../../components/AddTodo";
import TodoDialog from "../../components/TodoDialog";

const Project: NextPageWithLayout = () => {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  let { projectId } = router.query;
  projectId = typeof projectId === "object" ? projectId[0] : projectId;
  const {
    projectLists,
    isLoading: projectListsLoading,
    error: projectListsError,
  } = useProjectLists();
  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
  } = useTodos(projectId!);

  if (userLoading || projectListsLoading || todosLoading)
    return <div>loading</div>;
  if (!user) {
    router.replace("/");
    return <div></div>;
  }
  if (projectListsError || todosError) return <div>error while loading</div>;

  const currentProject = projectLists?.data.find(
    (project) => project.id === projectId
  );

  if (!currentProject) return <div>no project exist with this id</div>;

  return (
    <div className="p-1 mx-2 my-2 space-y-3">
      <h1 className="font-bold">{currentProject.name}</h1>
      <div className="flex flex-col space-y-3">
        {todos?.data.map((todo) => (
          <div key={todo.id}>
            <TodoDialog todo={todo} key={todo.id} project={currentProject}>
              <Todo todo={todo} key={todo.id} />
            </TodoDialog>
          </div>
        ))}
      </div>
      <AddTodo
        isDialog={false}
        todo={undefined}
        curProjForTodo={currentProject}
      >
        <div className="text-xs text-gray-500 flex cursor-pointer w-28">
          <PlusIcon className="w-4 h-4 text-emerald-700 mr-2" />
          Add task
        </div>
      </AddTodo>
    </div>
  );
};

Project.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
export default Project;

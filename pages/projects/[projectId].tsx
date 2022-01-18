import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { Fragment, ReactElement } from "react";
import Layout from "../../components/Layout";
import Todo from "../../components/Todo";
import useProjectLists from "../../hooks/useProjectLists";
import useTodos from "../../hooks/useTodos";
import NextPageWithLayout from "../../types/NextPageWithLayout ";
import {
  CheckIcon,
  DotsHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import AddTodo from "../../components/AddTodo";
import TodoDialog from "../../components/TodoDialog";
import { useSWRConfig } from "swr";
import { Project } from "@prisma/client";
import todoDone from "../../helpers/todoDone";
import todoDelete from "../../helpers/todoDelete";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import projectDelete from "../../helpers/projectDelete";
import LoadingSpinner from "../../components/LoadingSpinner";
import Error from "../../components/Error";

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
  const { mutate } = useSWRConfig();

  if (userLoading || projectListsLoading || todosLoading)
    return <LoadingSpinner />;
  if (!user) {
    router.replace("/");
    return <div></div>;
  }
  if (projectListsError || todosError)
    return <Error msg="Error while loading" emoji="😥" />;

  const currentProject = projectLists?.data.find(
    (project) => project.id === projectId
  );

  const indexProject = projectLists?.data.find((project) => project.isIndex);

  if (!currentProject)
    return <Error msg="No projext exist with that id" emoji="😬" />;

  return (
    <div className="p-1 mx-2 my-2 space-y-3 max-w-5xl">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-lg">{currentProject.name}</h1>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="hover:bg-gray-200 w-6 h-5 p-[2px] rounded-sm">
              <DotsHorizontalIcon className="w-5 h-5 text-gray-500" />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="py-2 border-[1px] border-gray-500 rounded-sm
          shadow-sm bg-white min-w-[150px]"
          >
            {!currentProject.isIndex ? (
              <DropdownMenu.Item
                className="px-1 py-1 flex text-xs items-center cursor-pointer 
            outline-none justify-start hover:bg-gray-100"
                onClick={() => {
                  projectDelete(currentProject, mutate);
                  router.replace(`/projects/${indexProject!.id}`);
                }}
              >
                <TrashIcon className="w-5 h-5 text-gray-400 mr-1" />
                Delete Project
              </DropdownMenu.Item>
            ) : null}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="flex flex-col space-y-1">
        {todos!.data.map((todo) => (
          <Fragment key={todo.id}>
            <div className="flex">
              <div
                className="w-4 h-4 rounded-full border-[1px] border-gray-700
                  mr-2 mt-1 cursor-pointer hover:bg-gray-200 flex justify-center 
                  items-center"
                onClick={() => todoDone(currentProject, todo, mutate)}
              >
                <CheckIcon className="w-4 h-4 text-gray-800 opacity-0 hover:opacity-100" />
              </div>
              <TodoDialog todo={todo} key={todo.id} project={currentProject}>
                <Todo todo={todo} key={todo.id} />
              </TodoDialog>
              <div
                className="p-[2px] flex justify-center items-center ml-auto 
              w-6 h-6 hover:bg-gray-100 self-center rounded-sm"
                onClick={() => todoDelete(currentProject, todo, mutate)}
              >
                <TrashIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <hr className="bg-gray-200 h-[0.8px]" />
          </Fragment>
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

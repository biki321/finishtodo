import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { Fragment, ReactElement } from "react";
import { useSWRConfig } from "swr";
import Layout from "../components/Layout";
import useProjectLists from "../hooks/useProjectLists";
import useTodosWithDateRange from "../hooks/useTodosWithDateRange";
import { DataType as TodosWithDateRangeType } from "../hooks/useTodosWithDateRange";
import NextPageWithLayout from "../types/NextPageWithLayout ";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  DotsHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import Todo from "../components/Todo";
import TodoDialog from "../components/TodoDialog";
import AddTodo from "../components/AddTodo";
import todoDone from "../helpers/todoDone";
import todoDelete from "../helpers/todoDelete";

const days = ["Sun", "Mon", "Tues", "Wed", "Thus", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Today: NextPageWithLayout = () => {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const {
    projectLists,
    isLoading: projectListsLoading,
    error: projectListsError,
  } = useProjectLists();

  const startDueDate = new Date();
  startDueDate.setHours(0, 0, 0, 0);
  const endDueDate = new Date();
  endDueDate.setHours(23, 59, 59, 999);

  const {
    todos,
    isLoading: todosLoading,
    error: todosError,
    url,
  } = useTodosWithDateRange(startDueDate, endDueDate);
  const { mutate } = useSWRConfig();

  if (userLoading || projectListsLoading || todosLoading)
    return <div>loading</div>;
  if (!user) {
    router.replace("/");
    return <div></div>;
  }
  if (projectListsError || todosError) return <div>error while loading</div>;
  const date = new Date();
  console.log("todo at today", todos);
  return (
    <div className="p-1 mx-2 my-2 space-y-3 max-w-5xl">
      <div className="flex justify-between mb-5">
        <h1 className="font-bold text-lg">
          {"Today"}{" "}
          <span className="text-xs font-normal text-gray-600">
            {days[date.getDay()] +
              " " +
              date.getDate() +
              " " +
              months[date.getMonth()]}
          </span>
        </h1>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <div className="hover:bg-gray-200 w-6 h-5 p-[2px] rounded-sm">
              <DotsHorizontalIcon className="w-5 h-5 text-gray-500" />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="py-2 border-[1px] border-gray-500 rounded-sm
          shadow-sm bg-white min-w-[150px]"
          ></DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <div className="flex flex-col space-y-1">
        {todos!.data.map((todo) => {
          const currentProject = projectLists?.data.find(
            (project) => project.id === todo.projectId
          );
          return (
            <Fragment key={todo.id}>
              <div className="flex">
                <div
                  className="w-4 h-4 rounded-full border-[1px] border-gray-700
                  mr-2 mt-1 cursor-pointer hover:bg-gray-200 flex justify-center 
                  items-center"
                  onClick={() => {
                    mutate(
                      url,
                      (data: TodosWithDateRangeType) => {
                        if (!data) return data;
                        return {
                          data: data.data.filter((ele) => ele.id !== todo.id),
                        };
                      },
                      false
                    );
                    todoDone(currentProject!, todo, mutate);
                  }}
                >
                  <CheckIcon className="w-4 h-4 text-gray-800 opacity-0 hover:opacity-100" />
                </div>
                <TodoDialog todo={todo} key={todo.id} project={currentProject!}>
                  <Todo todo={todo} key={todo.id} />
                </TodoDialog>
                <div
                  className="p-[2px] flex justify-center items-center ml-auto 
              w-6 h-6 hover:bg-gray-100 self-center rounded-sm"
                  onClick={() => {
                    mutate(
                      url,
                      (data: TodosWithDateRangeType) => {
                        if (!data) return data;
                        return {
                          data: data.data.filter((ele) => ele.id !== todo.id),
                        };
                      },
                      false
                    );
                    todoDelete(currentProject!, todo, mutate);
                  }}
                >
                  <TrashIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <hr className="bg-gray-200 h-[0.8px]" />
            </Fragment>
          );
        })}
      </div>
      <AddTodo isDialog={false} todo={undefined} curProjForTodo={undefined}>
        <div className="text-xs text-gray-500 flex cursor-pointer w-28">
          <PlusIcon className="w-4 h-4 text-emerald-700 mr-2" />
          Add task
        </div>
      </AddTodo>
    </div>
  );
};

Today.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Today;

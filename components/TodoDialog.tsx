import { Project, Todo } from "@prisma/client";
import * as Dialog from "@radix-ui/react-dialog";
import AddTodo from "./AddTodo";
import { XIcon } from "@heroicons/react/outline";
import { useSWRConfig } from "swr";

export default function TodoDialog({
  children,
  todo,
  project,
}: {
  children: JSX.Element;
  todo: Todo;
  project: Project;
}) {
  const { mutate } = useSWRConfig();
  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed  inset-0" />
        <Dialog.Content
          // Don't close the Alert Dialog when pressing ESC
          onEscapeKeyDown={(event) => event.preventDefault()}
          // Don't close the Alert Dialog when clicking outside
          onPointerDownOutside={(event) => event.preventDefault()}
          className="bg-white rounded-md shadow-2xl fixed p-4
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-screen-sm 
        h-[90vh]"
        >
          <div className="flex justify-between mb-2 text-sm">
            {project.name}
            <Dialog.Close>
              <XIcon className="w-5 h-5 text-gray-500" />
            </Dialog.Close>
          </div>
          <div key={todo.id} className="flex cursor-pointer min-w-[170px]">
            {/* <div
              className="w-4 h-4 rounded-full border-[1px] border-gray-700
                mr-2 mt-2 cursor-pointer"
              onClick={() => todoDone(project, todo, mutate)}
            ></div> */}
            <AddTodo isDialog={false} todo={todo} curProjForTodo={project}>
              <div className="space-y-2">
                <p className="text-left text-lg font-extrabold">{todo.todo}</p>
                <p className="text-xs text-left">{todo.description}</p>
                <p className="text-xs text-gray-600 text-left">
                  {todo.dueDate ? new Date(todo.dueDate).toDateString() : null}
                </p>
              </div>
            </AddTodo>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

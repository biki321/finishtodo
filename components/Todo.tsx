import { Todo } from "@prisma/client";

function Todo({ todo }: { todo: Todo }) {
  return (
    <div key={todo.id} className="flex cursor-pointer min-w-[170px]">
      <div
        className="w-4 h-4 rounded-full border-[1px] border-gray-700
         mr-2 mt-1"
      ></div>
      <div className="space-y-[2px]">
        <p className="text-sm text-left">{todo.todo}</p>
        <p className="text-xs text-gray-600 text-left">{todo.description}</p>
        <p className="text-xs text-gray-600 text-left">
          {todo.dueDate ? new Date(todo.dueDate).toDateString() : null}
        </p>
      </div>
    </div>
  );
}

export default Todo;

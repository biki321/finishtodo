import { Todo } from "@prisma/client";

function Todo({ todo }: { todo: Todo }) {
  return (
    <div key={todo.id} className="cursor-pointer min-w-[160px]">
      <div className="space-y-[2px]">
        <p className="text-sm text-left">{todo.todo}</p>
        <p className="text-xs text-gray-600 text-left">{todo.description}</p>
        <p className="text-xs text-gray-600 text-left">
          {todo.dueDate ? new Date(todo.dueDate).toDateString() : null}
        </p>
        <p>{todo.isCompleted}</p>
      </div>
    </div>
  );
}

export default Todo;

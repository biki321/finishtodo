import { Todo } from "@prisma/client";
import { useEffect, useState } from "react";

function Todo({ todo }: { todo: Todo }) {
  const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
  const [dueDateOver, setDueDateOver] = useState(false);
  useEffect(() => {
    console.log("effect todo");
    const id = setInterval(() => {
      if (todo.dueDate)
        if (new Date(todo.dueDate).getTime() < new Date().getTime()) {
          setDueDateOver(true);
        }
    }, 5000);
    return () => {
      clearInterval(id);
    };
  }, [todo.dueDate]);
  return (
    <div key={todo.id} className="cursor-pointer min-w-[160px]">
      <div className="space-y-[2px]">
        <p className="text-sm text-left">{todo.todo}</p>
        <p className="text-xs text-gray-600 text-left">{todo.description}</p>
        <p
          className={`text-xs text-left ${
            !dueDateOver ? "text-green-700" : "text-red-500"
          }`}
        >
          {dueDate
            ? `${dueDate.toDateString()} ${dueDate.getHours()}:${dueDate?.getMinutes()}`
            : null}
        </p>
        <p>{todo.isCompleted}</p>
      </div>
    </div>
  );
}

export default Todo;

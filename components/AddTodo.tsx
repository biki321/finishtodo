import * as Dialog from "@radix-ui/react-dialog";
import { XIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useUser } from "@auth0/nextjs-auth0";
import useProjectLists from "../hooks/useProjectLists";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InboxIcon, CheckIcon } from "@heroicons/react/outline";
import { FlagIcon } from "@heroicons/react/solid";
import { FlagIcon as FlagIconOutline } from "@heroicons/react/outline";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Priority, Project, Todo } from "@prisma/client";
import AutoTextArea from "./AutoTextArea";
import flagColors from "../helpers/flagColors";
import { useSWRConfig } from "swr";
import cuid from "cuid";

interface FormValues {
  todo: string;
  description: string;
  priority: Priority;
}

interface FormErrors {
  todo: string | undefined;
  description: string | undefined;
}

// const days = ["Sun", "Mon", "Tues", "Wed", "Thus", "Fri", "Sat"];

const validate = (values: FormValues) => {
  const errors: FormErrors = { todo: undefined, description: undefined };

  if (!values.todo) {
    errors.todo = "Required";
  } else if (values.todo.length > 15) {
    errors.todo = "Must be 15 characters or less";
  } else if (values.description.length > 15) {
    errors.todo = "Must be 15 characters or less";
  } else return undefined;
  return errors;
};

// server side errors upon submission have not been handled yet
function AddTodo({
  children,
  isDialog,
  todo,
  curProjForTodo,
}: {
  children: JSX.Element;
  isDialog: boolean;
  todo: Todo | undefined;
  curProjForTodo: Project | undefined;
}) {
  const { user } = useUser();
  const router = useRouter();
  const { projectLists, error } = useProjectLists();
  const [projectForTodo, setProjectForTodo] = useState<{
    id: undefined | string;
    name: string | undefined;
  }>({
    id: undefined,
    name: undefined,
  });
  const [openForm, setOpenForm] = useState(false);
  const { mutate } = useSWRConfig();
  const asPath = router.asPath.split("/");
  // const day = days[new Date().getDay()];
  // const tomorrow = days[(new Date().getDay() + 1) % 7];
  let initialDueDate: Date | null = null;
  if (asPath[1] === "today") {
    initialDueDate = new Date();
  }
  if (todo && todo.dueDate) {
    initialDueDate = new Date(todo.dueDate);
  }
  const [dueDate, setDueDate] = useState<Date | null>(initialDueDate);
  // console.log("router pathname", router.asPath.split("/"));

  const create = async (values: FormValues) => {
    const newTodo = {
      id: cuid(),
      todo: values.todo,
      description: values.description,
      dueDate: dueDate ? dueDate.toISOString() : null,
      projectId: projectForTodo.id,
      priority: values.priority,
    };
    formik.resetForm();
    mutate(
      `/api/projects/${projectForTodo.id}/todos`,
      (data: { data: Todo[] }) => {
        return { data: [...data.data, newTodo] };
      },
      false
    );

    const response = await fetch(`/api/projects/${projectForTodo.id}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (!response.ok) {
      mutate(
        `/api/projects/${projectForTodo.id}/todos`,
        (data: { data: Todo[] }) => {
          return data.data.filter((todo) => todo.id !== newTodo.id);
        },
        false
      );
    }
    mutate(`/api/projects/${projectForTodo.id}/todos`);
  };
  const update = async (values: FormValues) => {
    const updatedTodo = {
      id: todo!.id,
      todo: values.todo,
      description: values.description,
      dueDate: dueDate ? dueDate.toISOString() : null,
      projectId: projectForTodo.id,
      priority: values.priority,
    };
    // formik.resetForm();
    mutate(
      `/api/projects/${projectForTodo.id}/todos`,
      (data: { data: Todo[] }) => {
        const todos = data.data.map((ele) => {
          if (ele.id === updatedTodo.id) return updatedTodo;
          else return ele;
        });
        // const todos = data.data.filter((ele) => ele.id !== todo!.id);
        return { data: [...todos] };
      },
      false
    );

    const response = await fetch(
      `/api/projects/${projectForTodo.id}/todos/${todo!.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      }
    );

    if (!response.ok) {
      mutate(
        `/api/projects/${projectForTodo.id}/todos`,
        (data: { data: Todo[] }) => {
          const todos = data.data.map((ele) => {
            if (ele.id === updatedTodo.id) return todo;
            else return ele;
          });
          // const todos = data.data.filter((ele) => ele.id !== todo!.id);
          return { data: [...todos] };
        },
        false
      );
    }
    mutate(`/api/projects/${projectForTodo.id}/todos`);
  };
  const formik = useFormik<FormValues>({
    initialValues: {
      todo: todo ? todo.todo : "",
      description: todo && todo.description ? todo.description : "",
      priority: todo ? todo.priority : Priority.P4,
    },
    validate,
    onSubmit: async (values) => {
      if (!isDialog) setOpenForm(false);
      if (todo) {
        update(values);
      } else {
        create(values);
      }
    },
  });
  useEffect(() => {
    const asPath = router.asPath.split("/");
    let defaultProject: { id: undefined | string; name: string | undefined } = {
      id: undefined,
      name: undefined,
    };
    if (asPath[1] === "projects") {
      defaultProject.id = asPath[2];
      defaultProject.name = projectLists?.data.find(
        (project) => project.id === asPath[2]
      )?.name;
    } else {
      const project = projectLists?.data.find((project) => project.isIndex);
      defaultProject.id = project?.id;
      defaultProject.name = project?.name;
    }

    if (curProjForTodo) {
      defaultProject.id = curProjForTodo.id;
      defaultProject.name = curProjForTodo.name;
    }
    console.log("useefcect addto");
    // console.log("default project", defaultProject);
    setProjectForTodo(() => ({
      id: defaultProject.id,
      name: defaultProject.name,
    }));
  }, [curProjForTodo, projectLists?.data, router.asPath]);

  const CustomDatePicker = () => {
    // console.log("duedate", dueDate?.toISOString());
    return (
      <div>
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          minDate={new Date()}
          className="border-[1px] border-gray-400 rounded-md p-1
           outline-none"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="yyyy-MM-dd hh:mm aa"
          isClearable={false}
          // renderCustomHeader={({}) => (
          //   <div>
          //     <div className="text-sm space-y-1 mx-2 mb-1 text-gray-600">
          //       <div className="cursor-pointer py-1 flex items-center w-full">
          //         <CalendarIcon className="h-5 w-5 text-green-500 mr-2" />
          //         <span className="mr-auto font-bold">Today</span>
          //         <span className="text-gray-500 text-xs">{day}</span>
          //       </div>
          //       <div className="cursor-pointer py-1 flex items-center w-full">
          //         <SunIcon className="h-5 w-5 text-orange-300 mr-2" />
          //         <span className="mr-auto font-bold">Tomorrow</span>
          //         <span className="text-gray-500 text-xs">{tomorrow}</span>
          //       </div>
          //       <div className="cursor-pointer py-1 flex items-center w-full">
          //         <BanIcon className="h-5 w-5 text-gray-500 mr-2" />
          //         <span className="mr-auto font-bold">No Date</span>
          //       </div>
          //     </div>
          //     <hr className="bg-gray-800" />
          //   </div>
          // )}
        />
      </div>
    );
  };

  const PriorityDropDown = ({ children }: { children: JSX.Element }) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={1}
          className="min-w-[180px] rounded-md py-2 bg-white
           text-sm text-gray-800 shadow-sm border-[0.5px] border-gray-200"
        >
          {[Priority.P1, Priority.P2, Priority.P3, Priority.P4].map(
            (p, index) => (
              <DropdownMenu.Item
                key={p}
                className="p-1 hover:bg-gray-400 flex 
            items-center"
                onClick={() => formik.setFieldValue("priority", p)}
              >
                <FlagIcon className={`w-5 h-5 ${flagColors[p]} mr-2`} />
                <p className="mr-auto">{"Priority" + "   " + (index + 1)}</p>
                {p === formik.values.priority ? (
                  <CheckIcon className="w-4 h-4 text-blue-600" />
                ) : null}
              </DropdownMenu.Item>
            )
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  };

  const ProjectsDropDown = ({ children }: { children: JSX.Element }) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>{children}</DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={1}
          className="min-w-[200px] max-w-[250px] rounded-md shadow-sm py-2 bg-white
           border-[1px] border-gray-300"
        >
          {projectLists?.data.map((project) => (
            <DropdownMenu.Item
              key={project.id}
              className="cursor-pointer hover:bg-gray-200 py-1 px-2
              text-sm "
              onClick={() =>
                setProjectForTodo({ id: project.id, name: project.name })
              }
            >
              <div className="flex items-center">
                {project.isIndex ? (
                  <InboxIcon className="w-4 h-4 text-blue-500 mr-1 shrink-0" />
                ) : null}
                <p className="flex-1 truncate">{project.name}</p>
                {projectForTodo.id === project.id ? (
                  <CheckIcon className="w-4 h-4 text-green-600 shrink-0" />
                ) : null}
              </div>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  };

  const FormTodo = (
    <form onSubmit={formik.handleSubmit}>
      {formik.touched.todo && formik.errors.todo ? (
        <p className="text-xs text-red-500">{formik.errors.todo}</p>
      ) : null}

      <AutoTextArea
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="todo"
        id="todo"
        text={formik.values.todo}
        placeholder="eg., Write the letter"
        classNames="outline-none resize-none w-full text-sm font-semibold
     text-gray-800"
      />

      {formik.touched.description && formik.errors.description ? (
        <p className="text-xs text-red-500">{formik.errors.description}</p>
      ) : null}

      <AutoTextArea
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="description"
        id="description"
        text={formik.values.description}
        placeholder="description"
        classNames="outline-none resize-none w-full text-sm
     text-gray-800"
      />
      <div
        className="flex mb-5 items-center overflow-x-hidden flex-wrap
   space-y-1"
      >
        <div className="mr-1">
          <CustomDatePicker />
        </div>
        <div className="mr-auto">
          <ProjectsDropDown>
            <div
              className="border-[1px] border-gray-500 px-2 py-1 text-gray-800
        text-xs rounded-md flex items-center justify-center
         hover:bg-gray-200 mr-2 truncate"
            >
              {projectForTodo.name === "Inbox" ? (
                <InboxIcon className="text-blue-500 h-4 w-4 mr-1" />
              ) : null}
              {projectForTodo.name ?? "Inbox"}
            </div>
          </ProjectsDropDown>
        </div>

        <PriorityDropDown>
          <HoverCard.Root>
            <HoverCard.Trigger>
              <FlagIconOutline
                className={`w-7 h-7 ${
                  flagColors[formik.values.priority]
                } hover:bg-gray-200
       hover:text-gray-500 p-1 rounded-sm`}
              />
            </HoverCard.Trigger>
            <HoverCard.Content
              sideOffset={8}
              className="bg-gray-800 text-white text-sm py-1 px-2
         rounded-sm shadow-sm"
            >
              Set priority P1 P2 P3 P4
            </HoverCard.Content>
          </HoverCard.Root>
        </PriorityDropDown>
      </div>
      <hr />
      <div className="mt-2 flex items-center space-x-2">
        {!formik.isSubmitting ? (
          isDialog ? (
            <Dialog.Close
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className={`px-2 py-1 text-white bg-emerald-700 
        hover:bg-green-600 rounded-md text-xs font-semibold
        ${!formik.isValid || !formik.dirty ? "opacity-50" : ""}`}
              onClick={() => formik.submitForm()}
            >
              Save
            </Dialog.Close>
          ) : (
            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty}
              className={`px-2 py-1 text-white bg-emerald-700 
                    hover:bg-green-600 rounded-md text-xs font-semibold
                    ${!formik.isValid || !formik.dirty ? "opacity-50" : ""}`}
              onClick={() => formik.submitForm()}
            >
              Save
            </button>
          )
        ) : (
          <span>submitting</span>
        )}
        {isDialog ? (
          <Dialog.Close onClick={() => formik.resetForm()}>
            <XIcon className="h-5 w-5 text-gray-500" />
          </Dialog.Close>
        ) : (
          <div
            onClick={() => {
              formik.resetForm();
              setOpenForm(false);
            }}
            className="p-1 border-[1px] border-gray-500 rounded-md
             flex justify-center items-center text-xs cursor-pointer"
          >
            Cancel
          </div>
        )}
      </div>
    </form>
  );

  if (isDialog)
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
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm"
          >
            {FormTodo}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  else
    return openForm ? (
      <div className="p-1 border-[0.8px] border-gray-500 rounded-md ">
        {FormTodo}
      </div>
    ) : (
      <div onClick={() => setOpenForm(true)}>{children}</div>
    );
}

export default AddTodo;

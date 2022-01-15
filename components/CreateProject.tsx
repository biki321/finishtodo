import * as Dialog from "@radix-ui/react-dialog";
import * as Switch from "@radix-ui/react-switch";
import { XIcon } from "@heroicons/react/outline";
import { useFormik } from "formik";
import { useUser } from "@auth0/nextjs-auth0";

interface FormValues {
  projectName: string;
  isFav: boolean;
}

interface FormErrors {
  projectName: string | undefined;
  isFav: string | undefined;
}

const validate = (values: FormValues) => {
  const errors: FormErrors = { isFav: undefined, projectName: undefined };

  if (!values.projectName) {
    errors.projectName = "Required";
  } else if (values.projectName.length > 15) {
    errors.projectName = "Must be 15 characters or less";
  } else return undefined;
  return errors;
};

// server side errors upon submission have not been handled yet
function CreateProject({ children }: { children: JSX.Element }) {
  const { user } = useUser();
  const formik = useFormik<FormValues>({
    initialValues: {
      projectName: "",
      isFav: false,
    },
    validate,
    onSubmit: async (values) => {
      console.log("is submitting before", formik.isSubmitting);
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.projectName,
          isFav: values.isFav,
          userId: user!.sub!,
          isIndex: false,
        }),
      });
      //   if(!response.ok){
      //       formik.sta
      //   }
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed bg-gray-200 inset-0 opacity-50" />
        <Dialog.Content
          // Don't close the Alert Dialog when pressing ESC
          onEscapeKeyDown={(event) => event.preventDefault()}
          // Don't close the Alert Dialog when clicking outside
          onPointerDownOutside={(event) => event.preventDefault()}
          className="bg-white rounded-md shadow-md fixed p-4
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm"
        >
          <Dialog.Title className="font-bold">Add project</Dialog.Title>
          <br />
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="projectName" className="text-sm block mb-2">
              Name
            </label>

            {formik.touched.projectName && formik.errors.projectName ? (
              <p className="text-xs text-red-500">
                {formik.errors.projectName}
              </p>
            ) : null}
            <input
              type="text"
              id="projectName"
              name="projectName"
              value={formik.values.projectName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="text-sm border-[1px] border-gray-900 rounded-sm p-1
              w-full mb-5"
            />
            <Switch.Root
              value={formik.values.isFav ? "on" : "off"}
              id="isFav"
              name="isFav"
              className={`w-11 h-6 rounded-full relative ${
                formik.values.isFav ? "bg-green-700" : "bg-gray-300"
              }  `}
              onCheckedChange={(val) => {
                formik.setFormikState((prevState) => ({
                  ...prevState,
                  values: { ...prevState.values, isFav: val },
                }));
              }}
            >
              <Switch.Thumb
                className={`w-5 h-5 rounded-full shadow-sm bg-white
               block translate-x-1 ${
                 formik.values.isFav && "translate-x-full"
               } ease-linear duration-150`}
              />
            </Switch.Root>
            <label htmlFor="isFav" className="text-sm">
              Add to favorites
            </label>
            <div className="mt-5 flex justify-end items-center space-x-2">
              <Dialog.Close onClick={() => formik.resetForm()}>
                <XIcon className="h-5 w-5 text-gray-500" />
              </Dialog.Close>
              {!formik.isSubmitting ? (
                <button
                  type="submit"
                  disabled={!formik.isValid || !formik.dirty}
                  className={`px-2 py-1 text-white bg-emerald-700 
                hover:bg-green-600 rounded-md text-xs font-semibold 
                ${!formik.isValid || !formik.dirty ? "opacity-50" : ""}`}
                >
                  Create
                </button>
              ) : (
                <span>submitting</span>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default CreateProject;

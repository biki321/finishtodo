import { Project } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import AvatarDropDown from "./AvatarDropDown";
import Drawer from "./Drawer";
import {
  CancelIcon,
  CheckCircleIcon,
  HomeIcon,
  MenuIcon,
  PlusIcon,
} from "./Icons";

type JSONResponse = {
  data?: Project[];
  error?: string;
};

const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    console.log("res not ok");
    const errorObj = new Error() as Error & { status: number };
    const error = await res.json();
    errorObj.message = error.error;
    errorObj.status = error.status;
    throw errorObj;
  }
  return res.json();
};

function Layout({ children }: { children: JSX.Element | JSX.Element[] }) {
  //user will exist because this page won't render without an authenticated user
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = () => setDrawerOpen((prevState) => !prevState);
  const { data: projectLists, error } = useSWR<
    { data: Project[] },
    Error & { status: number }
  >("/api/projects", fetcher);

  if (error) {
    console.log(error);
    return <div>failed to load</div>;
  }
  if (!projectLists) return <div>loading...</div>;

  return (
    <>
      <div className="bg-emerald-700 p-3 flex justify-between h-12">
        <div className="flex space-x-3">
          <div onClick={handleDrawer}>
            {drawerOpen ? <CancelIcon /> : <MenuIcon />}
          </div>
          <HomeIcon />
        </div>
        <div className="flex space-x-3">
          <PlusIcon />
          <CheckCircleIcon />
          <AvatarDropDown />
        </div>
      </div>
      <div className="flex">
        <div
          className={`absolute left-[-100%] md:left-0 top-12 bottom-0 
        ${
          drawerOpen
            ? "translate-x-[100%] md:translate-x-[-100%]"
            : "translate-x-0"
        }  ease-in-out duration-150`}
        >
          <Drawer
            handleDrawer={handleDrawer}
            projectLists={projectLists.data}
          />
        </div>
        <div className={`${!drawerOpen ? "md:ml-[320px]" : "md:ml-0"}`}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;

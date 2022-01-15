import { useState } from "react";
import useProjectLists from "../hooks/useProjectLists";
import AddTodo from "./AddTodo";
import AddTodoDialog from "./AddTodo";
import AvatarDropDown from "./AvatarDropDown";
import Drawer from "./Drawer";
import {
  CancelIcon,
  CheckCircleIcon,
  HomeIcon,
  MenuIcon,
  PlusIcon,
} from "./Icons";

function Layout({ children }: { children: JSX.Element | JSX.Element[] }) {
  //user will exist because this page won't render without an authenticated user
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawer = () => setDrawerOpen((prevState) => !prevState);
  const { error, projectLists } = useProjectLists();
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
          <AddTodo isDialog={true} todo={undefined}>
            <PlusIcon />
          </AddTodo>
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

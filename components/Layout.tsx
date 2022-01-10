import { useUser } from "@auth0/nextjs-auth0";
import { useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
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
  const { user } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawer = () => setDrawerOpen((prevState) => !prevState);

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
          <Drawer handleDrawer={handleDrawer} />
        </div>
        <div className={`${!drawerOpen ? "md:ml-[280px]" : "md:ml-0"}`}>
          {children}
        </div>
      </div>
    </>
  );
}

export default Layout;

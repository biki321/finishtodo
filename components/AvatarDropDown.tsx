import { useUser } from "@auth0/nextjs-auth0";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogoutIcon } from "./Icons";
import Avatar from "./Avatar";

export default function AvatarDropDown() {
  const { user } = useUser();
  if (!user) return null;
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar size={6} />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={1}
        className="max-w-[262] rounded-md shadow-md p-3 bg-white
        space-y-2 outline-none"
      >
        <DropdownMenu.Item className="cursor-pointer">
          <div className="flex">
            <Avatar size={1} />
            <div className="ml-3">
              <p className="text-[12.96px] font-bold">
                {user.nickname?.toUpperCase()}
              </p>
              <p className="text-[12.95px] font-thin ">{user.name}</p>
            </div>
          </div>
        </DropdownMenu.Item>
        <hr className="text-gray-300" />
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/auth/logout">
          <DropdownMenu.Item className="cursor-pointer">
            <div className="flex items-center text-[12.96px]">
              <div className="mr-5">
                <LogoutIcon />
              </div>
              <span>Logout</span>
            </div>
          </DropdownMenu.Item>
        </a>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

import Link from "next/link";
import CalendarIconSolid, { DateIconOuline, InboxIcon } from "./Icons";

interface IProp {
  handleDrawer: () => void;
}

const LinkComp = ({
  children,
  href,
  name,
}: {
  children: JSX.Element;
  href: string;
  name: string;
}) => (
  <div
    className="flex space-x-1 items-center cursor-pointer 
  hover:bg-gray-300 focus:bg-gray-300 rounded-md px-2"
  >
    {children}
    <Link href={href}>
      <a className="text-sm">{name}</a>
    </Link>
  </div>
);

function Drawer({ handleDrawer }: IProp) {
  return (
    <div
      className="min-w-[280px] bg-white shadow-md h-full border-r-2
     flex flex-col items-center md:shadow-none"
    >
      <div className="md:w-4/5 md:self-start pl-8 pt-5 space-y-4">
        <LinkComp href={"/"} name="Inbox">
          <InboxIcon />
        </LinkComp>
        <LinkComp href={"/"} name="Today">
          <DateIconOuline />
        </LinkComp>
        <LinkComp href={"/"} name="Upcoming">
          <CalendarIconSolid />
        </LinkComp>
      </div>
    </div>
  );
}

export default Drawer;

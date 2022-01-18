import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ChevronRightIcon, PlusIcon } from "@heroicons/react/outline";
import CalendarIconSolid, { DateIconOuline, InboxIcon } from "./Icons";
import { useState } from "react";
import CreateProject from "./CreateProject";
import { Project } from "@prisma/client";
import { useRouter } from "next/router";

interface IProp {
  handleDrawer: () => void;
  projectLists: Project[];
}

function Drawer({ handleDrawer, projectLists }: IProp) {
  const router = useRouter();
  const asPath = router.asPath.split("/");
  console.log(asPath);
  const [accordianValue, setAccordianValue] = useState("");
  const getTriggerClass = (triggerValue: string) => {
    return triggerValue === accordianValue ? "rotate-90" : "rotate-0";
  };
  const indexProjectId = projectLists.find((project) => project.isIndex)?.id;

  const LinkComp = ({
    children,
    href,
    name,
    focused,
  }: {
    children: JSX.Element;
    href?: string;
    name: string;
    focused: boolean;
  }) =>
    href ? (
      <Link href={href}>
        <a
          className={`flex space-x-1 items-center cursor-pointer 
          ${
            focused ? "bg-gray-200" : ""
          } hover:bg-gray-300 rounded-md p-2 w-full`}
          // onClick={handleDrawer}
        >
          {children}
          <span className="text-sm">{name}</span>
        </a>
      </Link>
    ) : (
      <div
        className="flex space-x-1 items-center 
   hover:bg-gray-300 focus:bg-gray-300 rounded-md p-2 w-full"
      >
        {children}
        <span className="text-sm">{name}</span>
      </div>
    );

  return (
    <div
      className="min-w-[290px] md:min-w-[320px] bg-gray-100 shadow-md h-full border-r-2
     flex flex-col items-center md:shadow-none overflow-x-hidden"
    >
      <div className="w-4/5 self-end pl-11 md:w-4/5 md:self-start md:pl-8 pt-5">
        <LinkComp
          href={indexProjectId ? "/projects/" + indexProjectId : undefined}
          name="Inbox"
          focused={asPath[1] === "projects" && asPath[2] === indexProjectId}
        >
          <InboxIcon />
        </LinkComp>
        <LinkComp name="Today" href="/today" focused={asPath[1] === "today"}>
          <DateIconOuline />
        </LinkComp>
        <LinkComp name="Upcoming" focused={false}>
          <CalendarIconSolid />
        </LinkComp>
        <br />
        <Accordion.Root
          type="single"
          collapsible
          onValueChange={setAccordianValue}
          className="pr-2"
        >
          <Accordion.Item value="projects">
            <Accordion.Header className="flex items-center justify-between">
              <Accordion.Trigger className="flex-1">
                <div className="flex items-center">
                  <ChevronRightIcon
                    className={`h-4 w-4 text-gray-500 mr-1
                     ease-in-out duration-150 
                    ${getTriggerClass("projects")}`}
                  />
                  <p className="font-bold text-sm">Projects</p>
                </div>
              </Accordion.Trigger>
              <CreateProject>
                <PlusIcon className="h-4 w-4 ml-1 text-gray-500  rounded-sm" />
              </CreateProject>
            </Accordion.Header>
            <Accordion.Content className="text-sm text-gray-700 pl-3 pt-2 space-y-2">
              {projectLists.map((project) =>
                !project.isIndex ? (
                  <div
                    key={project.id}
                    className={`p-1 rounded-sm ${
                      asPath[1] === "projects" && asPath[2] === project.id
                        ? "bg-gray-200"
                        : ""
                    }`}
                  >
                    <Link href={`/projects/${project.id}`}>
                      <a className="truncate">{project.name}</a>
                    </Link>
                  </div>
                ) : null
              )}
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}

export default Drawer;

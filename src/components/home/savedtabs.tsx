import { useGlobal } from "@/contexts/Global/context";
import { TabLinkDto } from "@/models/models";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import TabLink from "./tablink";

import { Disclosure } from "@headlessui/react";
import { MdChevronRight } from "react-icons/md";
import { TbMenu2 } from "react-icons/tb";

export default function SavedTabs() {
  const { savedTabs, removeSavedTab } = useGlobal();
  const folders: { [key: string]: TabLinkDto[] } = { Favourites: [] };
  for (let tab of savedTabs) {
    const folderName = tab.folder ?? "Favourites";
    if (folders[folderName]) {
      folders[folderName].push(tab);
    } else {
      folders[folderName] = [tab];
    }
  }

  const deleteFolder = (folder: string) => {
    for (let tablink of savedTabs) {
      if (tablink.folder === folder) {
        removeSavedTab(tablink);
      }
    }
  };

  const folderMenu = (folder: string) => (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`pt-3 inline-flex items-center dark:bg-slate-700 bg-slate-300 text-gray-800 dark:text-white rounded-lg p-3 h-9 w-9 transition-all duration-300 ease-in-out

`}
        >
          <TbMenu2 />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => deleteFolder(folder)}
                  className={`${
                    active ? "bg-blue-700 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );

  return (
    <div>
      {Object.keys(savedTabs).length === 0 || (
        <div>
          <Disclosure>
            {({ open }) => (
              <>
                <Disclosure.Button className="py-2 inline-flex">
                  <MdChevronRight
                    className={
                      open
                        ? "rotate-90 transition-transform ease-in-out text-2xl mt-[0.35rem]"
                        : "transition-transform ease-in-out text-2xl mt-[0.35rem]"
                    }
                  />
                  <span className="text-center text-2xl">Favourites</span>
                </Disclosure.Button>
                <Disclosure.Panel className="flex flex-col gap-2 mt-2">
                  {Object.keys(folders).map((folder, i) =>
                    folder === "Favourites" ? (
                      <div key={i} className="flex flex-col gap-2">
                        {folders[folder].map((t, j) => (
                          <TabLink key={j} tablink={{ ...t, saved: true }} />
                        ))}
                      </div>
                    ) : (
                      <Disclosure
                        key={i}
                        defaultOpen={true}
                        as="div"
                        className="bg-gray-200 dark:bg-slate-800 px-4 py-4 rounded-xl transition ease-in-out"
                      >
                        {({ open }) => (
                          <>
                            <div className="py-2 inline-flex place-content-between w-full">
                              <Disclosure.Button className="inline-flex">
                                  <MdChevronRight
                                    className={
                                      open
                                        ? "rotate-90 transition-transform ease-in-out text-xl mt-[0.35rem]"
                                        : "transition-transform ease-in-out text-xl mt-[0.35rem]"
                                    }
                                  />
                                  <span className="text-center text-xl">
                                    {folder}
                                  </span>
                              </Disclosure.Button>
                              {folderMenu(folder)}
                            </div>
                            <Disclosure.Panel className="flex flex-col gap-2 mt-2 fad">
                              {folders[folder].map((t, j) => (
                                <TabLink
                                  key={j}
                                  tablink={{ ...t, saved: true }}
                                />
                              ))}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    )
                  )}
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        </div>
      )}
    </div>
  );
}

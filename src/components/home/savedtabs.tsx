import { useGlobal } from "@/contexts/Global/context";
import { TabLinkDto } from "@/models/models";
import TabLink from "./tablink";

import { Disclosure } from "@headlessui/react";
import { MdChevronRight } from "react-icons/md";

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

  const deleteFolder = (folder: TabLinkDto[]) => {
    for (let tablink of folder) {
      removeSavedTab(tablink);
    }
  };

  console.log(savedTabs)

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
                            <Disclosure.Button className="py-2 inline-flex">
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

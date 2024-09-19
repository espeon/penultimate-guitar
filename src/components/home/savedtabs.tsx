import useSavedTabs from "@/hooks/useSavedTabs";
import { IndividualPlaylist } from "@/models/models";
import { Folder } from "@/types/user";
import { trpc } from "@/utils/trpc";
import { Menu, Transition } from "@headlessui/react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Fragment, useRef, useState } from "react";
import ImportPlaylistDialog from "../dialog/importplaylistdialog";
import LoadingSpinner from "../loadingspinner";
import TabLink from "./tablink";
import { useSession } from "next-auth/react";
import PlainButton from "../shared/plainbutton";

function sortByName(s1: string, s2: string) {
  return s1 > s2 ? 1 : -1;
}

export default function SavedTabs() {
  const { savedTabs, flatTabs, isLoadingTabs } = useSavedTabs();
  const allSaved = flatTabs.map((t) => t.taburl);

  const favourites = savedTabs.find((f) => f.name === "Favourites");
  return (
    <div>
      <div>
        <div className="pt-4">
          <h1 className="text-left text-xl">Favourites</h1>
        </div>
        {isLoadingTabs ? (
          <LoadingSpinner className="h-8" />
        ) : allSaved.length === 0 ? (
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-center">
              You have no saved tabs yet! Press{" "}
              <BookmarkIcon className="h-[1em] inline-block" /> to save a tab.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 mt-2">
            <>
              {favourites && (
                <div className="flex flex-col gap-1">
                  {favourites.tabs
                    .sort((a, b) => sortByName(a.name ?? "", b.name ?? ""))
                    .map((t, j) => (
                      <TabLink
                        key={j}
                        tablink={{ ...t, saved: true }}
                        folder={favourites.name}
                      />
                    ))}
                </div>
              )}
              {savedTabs
                .sort((a, b) => sortByName(a.name, b.name))
                .filter((f) => f.name !== "Favourites")
                .map((folder, i) => (
                  <FolderPanel folder={folder} key={`${i}-${folder.name}`} />
                ))}
            </>
          </div>
        )}
      </div>
    </div>
  );
}

function FolderPanel({ folder }: { folder: Folder }) {
  const [hovering, setHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="" ref={divRef}></div>
      <div
        className={
          "bg-gray-200 dark:bg-gray-800 dark:border-gray-600 rounded-xl border transition-transform duration-75 max-h-fit " +
          (hovering ? " hover:border-gray-400 dark:hover:border-gray-700" : "")
        }
        id={`folder-${folder.id}`}
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
      >
        <div
          className="flex justify-between p-2 px-3 items-center sticky top-0 bg-gray-200 dark:bg-gray-800 rounded-xl"
          onClick={() => {
            if (
              isOpen &&
              divRef.current &&
              window.scrollY > divRef.current.offsetTop
            ) {
              divRef.current.scrollIntoView({ behavior: "smooth" });
            }
            setIsOpen(!isOpen);
          }}
        >
          <h2 className="text-lg">{folder.name}</h2>
          <div className="flex justify-between gap-2 items-center">
            {folder.imageUrl && (
              <Link
                href={`https://open.spotify.com/playlist/${folder.playlistUrl}`}
                target="_blank"
              >
                <img
                  src={folder.imageUrl ?? undefined}
                  className="w-8 h-8 rounded"
                />
              </Link>
            )}
            <ChevronLeftIcon
              className={"w-4 h-4 transition " + (isOpen ? "-rotate-90" : "")}
            />
          </div>
        </div>
        {isOpen && (
          <div
            className={"flex flex-col gap-1 p-2 pt-0 mt-0 "}
            style={{ transition: "max-height 1s ease-in-out" }}
          >
            {folder.tabs
              .sort((a, b) => sortByName(a.name ?? "", b.name ?? ""))
              .map((t, j) => (
                <TabLink
                  key={j}
                  tablink={{ ...t, saved: true }}
                  folder={folder.name}
                />
              ))}
            <div className={"flex justify-between items-middle "}>
              <div className="ml-2">{folder.tabs?.length} items</div>
              <FolderMenu folder={folder} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FolderMenu({ folder }: { folder: Folder }) {
  const { removeFolder } = useSavedTabs();

  const { data, refetch } = trpc.spotify.getPlaylist.useQuery(
    { playlistId: folder.playlistUrl ?? "", save: true },
    {
      enabled: false,
    }
  );
  const getTab = trpc.tab.getTabLazy.useMutation();
  const [playlist, setPlaylist] = useState<IndividualPlaylist>();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const refreshPlaylist = async () => {
    await refetch();
    setIsImportOpen(true);
    setPlaylist(data);
  };

  const scrapeAll = async () => {
    for (let tabLink of folder.tabs) {
      getTab.mutate(tabLink.taburl);
      await new Promise((r) => setTimeout(r, 8000));
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>
            <PlainButton noPadding>
              <div className="px-4 w-10 flex justify-center items-center">
                ▼
              </div>
            </PlainButton>
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
          <Menu.Items className="z-10 absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {folder.playlistUrl && (
                <>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={`https://open.spotify.com/playlist/${folder.playlistUrl}`}
                        target="_blank"
                        className={`${
                          active
                            ? "bg-blue-700 text-white"
                            : "text-gray-900  dark:text-gray-200"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm no-underline`}
                      >
                        View playlist on Spotify
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => refreshPlaylist()}
                        className={`${
                          active
                            ? "bg-blue-700 text-white"
                            : "text-gray-900  dark:text-gray-200"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Refresh playlist
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => scrapeAll()}
                        className={`${
                          active
                            ? "bg-blue-700 text-white"
                            : "text-gray-900  dark:text-gray-200"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        Pull all tracks
                      </button>
                    )}
                  </Menu.Item>
                </>
              )}
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => removeFolder(folder.name)}
                    className={`${
                      active ? "bg-blue-700 text-white" : "text-gray-900"
                    } group dark:text-white flex w-full items-center rounded-md px-2 py-2 text-sm`}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      {isImportOpen && playlist && (
        <ImportPlaylistDialog
          playlist={playlist}
          isOpen={isImportOpen}
          setIsOpen={setIsImportOpen}
        />
      )}
    </>
  );
}

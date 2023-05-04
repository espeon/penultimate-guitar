import { useGlobal } from "@/contexts/Global/context";
import { Playlist } from "@/models/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ImportPlaylistDialog from "../dialog/importplaylistdialog";
import { TbSearch } from "react-icons/tb";

export default function SearchBox() {
  const router = useRouter();

  const [buttonText, setButtonText] = useState<string | JSX.Element>("Search");
  const [searchText, setLocalSearchText] = useState("");
  const { setSearchText } = useGlobal();

  useEffect(() => {
    if (router.route === "/") {
      setSearchText("");
      setLocalSearchText("");
    }
  }, [router.route, setSearchText]);

  useEffect(() => {
    setTimeout(() => {
      setSearchText(searchText);
    }, 50);
  }, [searchText, setSearchText]);

  const [playlist, setPlaylist] = useState<Playlist>();
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const search: string = event.target.url.value;
    console.log(search);

    const processPlaylist = async (playlistUrl: string) => {
      console.log("Searching for playlist", playlistUrl);
      setButtonText("Loading...");

      const matches = playlistUrl.match(
        /https:\/\/open\.spotify\.com\/playlist\/(?<id>[0-9A-Za-z]+).*/
      );
      const playlistId = matches?.groups?.id;
      await fetch("/api/playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlistId: playlistId,
        }),
      })
        .then((res) => res.json())
        .then((data: Playlist) => {
          setButtonText("Search");
          setIsImportOpen(true);
          setPlaylist(data);
        })
        .catch(() => {
          setButtonText("Search");
        });
    };

    if (search.startsWith("https://tabs.ultimate-guitar.com/tab/")) {
      router.push(`/tab/${search.slice(37)}`);
    } else if (search.startsWith("https://open.spotify.com/playlist/")) {
      processPlaylist(search);
    } else {
      router.push(`/search/${event.target.url.value}`);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative max-w-2xl mx-auto my-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none dark:text-blue-800 text-blue-300">
            <TbSearch className="text-xl" />
          </div>
          <input
            type="search"
            id="default-search"
            name="url"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-100"
            placeholder="Song name, Tab URL, or Spotify playlist URL..."
            required
            value={searchText}
            onChange={(e) => setLocalSearchText(e.target.value)}
          />
          <button
            disabled={buttonText !== "Search"}
            type="submit"
            className="text-black dark:text-white absolute right-2.5 bottom-2.5 bg-slate-400 dark:bg-slate-600 hover:bg-slate-500 dark:hover:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 transition-all"
          >
            {buttonText}
          </button>
        </div>
      </form>
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

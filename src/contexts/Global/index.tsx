import { ChordDB } from "@/models/chorddb.models";
import { PlaylistCollection, SavedUserTabLinks } from "@/models/models";
import { useAuthStore } from "@/state/auth";
import { useConfigStore } from "@/state/config";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { GlobalContextProps, GlobalContextProvider } from "./context";
import { useSavedTabsStore } from "@/state/savedTabs";

const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<PlaylistCollection>({});
  const { guitarChords, setGuitarChords } = useConfigStore();
  const { setUserAllTabLinks } = useSavedTabsStore();

  const session = useSession();
  const userId = session?.data?.user?.id;
  const { setUserId } = useAuthStore();

  useEffect(() => {
    if (userId) setUserId(userId);
    else setUserId(undefined);
  }, [userId]);

  useEffect(() => {
    // put old saved tabs into new format and remove old format
    const parsedTabs = JSON.parse(
      localStorage.getItem("savedUserTabs") ?? "{}"
    ) as SavedUserTabLinks;

    console.log("getSavedTabs", userId);
    if (parsedTabs["@localStorage"]) {
      setUserAllTabLinks(parsedTabs["@localStorage"], "@localStorage");
      localStorage.removeItem("savedUserTabs");
    }
  }, []);

  useEffect(() => {
    if (!guitarChords) {
      fetch("/chords/guitar.json", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res: ChordDB.GuitarChords) => {
          setGuitarChords(res);
        });
    }
    getPlaylists();
  }, []);

  useEffect(() => {
    updatePlaylists(playlists);
  }, [playlists]);

  const getPlaylists = () => {
    const parsedPlaylists = JSON.parse(
      localStorage.getItem("playlists") ?? "{}"
    ) as PlaylistCollection;
    setPlaylists(parsedPlaylists);
  };

  const updatePlaylists = (playlists: PlaylistCollection) => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  };

  const value: GlobalContextProps = useMemo(
    () => ({
      playlists,
      setPlaylists,
    }),
    [playlists, setPlaylists]
  );

  return (
    <GlobalContextProvider value={value}>{children}</GlobalContextProvider>
  );
};

export default GlobalProvider;

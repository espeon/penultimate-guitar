import prisma from "@/lib/prisma";
import { Song } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";

type ListProps = {
  allTabs: {
    songId: number;
    taburl: string;
    type: string;
    version: number;
    song: Song;
  }[];
};

export default function Directory({ allTabs }: ListProps) {
  const multipleVersions: { [key: string]: boolean } = {};
  for (let tab of allTabs) {
    if (multipleVersions[tab.songId] === undefined) {
      multipleVersions[tab.songId] = false;
    } else if (multipleVersions[tab.songId] === false) {
      multipleVersions[tab.songId] = true;
    }
  }

  console.log(savedTabs)
  return (
    <>
      <Head>
        <title>Song Directory</title>
      </Head>
<<<<<<< Updated upstream
      <div className="w-fit m-auto wrap">
        <div className="mx-8">
          {Object.keys(multipleVersions).length} songs, {allTabs.length} tabs
          <ol className=" max-w-xl">
            {allTabs.map((t, i) => (
              <li key={i}>
                <Link href={`/tab/${t.taburl}`} prefetch={false}>
                  {t.song.artist} - {t.song.name}
                  {multipleVersions[t.songId] && (
                    <span className="font-light text-xs">
                      {" "}
                      (v{t.version}) ({t.type})
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ol>
=======
      <div className="max-w-xl mx-auto flex flex-col gap-2 my-8">
        <div className="mx-x">
          <div className="text-2xl mb-2">
            {searchText.length > 0
              ? 'Searching for "' + searchText + '" in the directory'
              : "Directory"}
          </div>
          <div className="mb-4">
            There are {Object.keys(multipleVersions).length} songs,{" "}
            {filteredTabs.length} tabs
          </div>
          {filteredTabs.map((t, i) => {
            let s = savedTabs.find(
              ({ name, artist, type, version }) =>
                name === t.song.name &&
                artist === t.song.artist &&
                type === t.type &&
                version === t.version
            );
            let d = convertToTabLink(t);
            d.type = t.type;
            return (
              <div className="mb-4 font-sm" key={i}>
                <TabLink tablink={{ ...d, saved: s?.saved }} recent={false} />
              </div>
            );
          })}
>>>>>>> Stashed changes
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const savedTabs = await prisma.tab.findMany({
    where: {
      tab: {
        not: "ALT",
      },
    },
    select: {
      taburl: true,
      songId: true,
      type: true,
      version: true,
      song: true,
    },
    orderBy: [
      {
        song: {
          artist: "asc",
        },
      },
      {
        song: {
          name: "asc",
        },
      },
      {
        type: "asc",
      },
      {
        version: "asc",
      },
    ],
  });

  return {
    props: { allTabs: savedTabs },
    revalidate: 60,
  };
}

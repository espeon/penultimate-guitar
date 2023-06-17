import { useGlobal } from "@/contexts/Global/context";
import prisma from "@/lib/prisma";
import { tabCompareFn } from "@/lib/sort";
import { Song } from "@prisma/client";
import _ from "lodash";
import { GetStaticProps } from "next";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type TabMetadata = {
  songId: number;
  taburl: string;
  type: string;
  version: number;
  song: Song;
  timestamp: string;
  rating: number;
};

type ListProps = {
  allTabs: TabMetadata[];
};

export default function Directory({ allTabs }: ListProps) {
  const router = useRouter();

  const { searchText, setSearchText } = useGlobal();

  const [collapseVersions, setCollapseVersions] = useState(
    true
    //router.query.order === "artist"
  );

  useEffect(() => {
    setSearchText("");
  }, [setSearchText]);

  //useEffect(() => {
  //if (router.query.order === "artist") {
  //    setCollapseVersions(true);
  //  } else {
  //    setCollapseVersions(false);
  //  }
  //}, [router.query]);

  if (searchText.length >= 3) {
    let lowerSearch = searchText.toLowerCase();
    allTabs = allTabs.filter(
      (t) =>
        t.song.name.toLowerCase().includes(lowerSearch) ||
        t.song.artist.toLowerCase().includes(lowerSearch)
    );
  }

  const groupedOrder: number[] = [];
  const groupedVersions: { [key: string]: TabMetadata[] } = {};
  const topResults: { [key: string]: TabMetadata } = {};
  for (let tab of allTabs) {
    if (groupedVersions[tab.songId] === undefined) {
      groupedVersions[tab.songId] = [tab];
      groupedOrder.push(tab.songId);
    } else {
      groupedVersions[tab.songId].push(tab);
    }
    if (topResults[tab.songId] === undefined) {
      topResults[tab.songId] = tab;
    } else if (
      topResults[tab.songId].type == "Tab" ||
      topResults[tab.songId].type == "Chords"
        ? topResults[tab.songId].rating + 3
        : topResults[tab.songId].rating < tab.rating
    ) {
      topResults[tab.songId] = tab;
    }
  }

  const generateLink = (t: TabMetadata) => (
    <Link
      href={`/tab/${t.taburl}`}
      prefetch={false}
      title={t.timestamp}
      className="color-unset"
    >
      {t.song.artist} - {t.song.name}
      {groupedVersions[t.songId].length > 1 && (
        <span className="font-light text-xs">
          {" "}
          ({t.type}) (v{t.version})
        </span>
      )}
    </Link>
  );

  const tabList = collapseVersions ? (
    <>
      {groupedOrder.map((songId, i) => (
        <li key={i}>
          {groupedVersions[songId].length === 1 ? (
            generateLink(groupedVersions[songId][0])
          ) : (
            <details>
              <summary>
                <Link
                  href={"/tab/" + topResults[songId].taburl}
                  prefetch={false}
                  title={topResults[songId].timestamp}
                  className="color-unset"
                >
                  {groupedVersions[songId][0].song.artist} -{" "}
                  {groupedVersions[songId][0].song.name}{" "}
                </Link>
                <span className="font-light text-xs">
                  ({groupedVersions[songId].length} versions)
                </span>
              </summary>
              <ul className="pl-4">
                {groupedVersions[songId].sort(tabCompareFn).map((t, j) => (
                  <li key={j}>{generateLink(t)}</li>
                ))}
              </ul>
            </details>
          )}
        </li>
      ))}
    </>
  ) : (
    <>
      {allTabs.map((t, i) => (
        <li key={i}>{generateLink(t)}</li>
      ))}
    </>
  );

  return (
    <>
      <Head>
        <title>Song Directory</title>
      </Head>
      <div className="max-w-full w-[40rem] m-auto wrap">
        <div className="flex justify-between items-center gap-2 flex-wrap-reverse">
          <div>
            {Object.keys(groupedVersions).length} songs, {allTabs.length} tabs
          </div>
          <div className="flex gap-2 items-center justify-end">
            <label className="whitespace-nowrap">
              <input
                type="checkbox"
                checked={collapseVersions}
                onChange={() => setCollapseVersions((old) => !old)}
              />{" "}
              Group by song
            </label>{" "}
            <select
              className="p-2 rounded-md"
              name="order"
              id="order"
              defaultValue={router.query.order}
              onChange={(e) => router.push(`/directory/${e.target.value}`)}
            >
              <option key="artist" value="artist">
                By artist
              </option>
              <option key="new" value="new">
                By newest
              </option>
              <option key="old" value="old">
                By oldest
              </option>
            </select>
          </div>
        </div>
        <hr className="m-2" />

        <div className="mx-8">
          <ol className=" max-w-xl">{tabList}</ol>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const paths = [
    { params: { order: "artist" } },
    { params: { order: "new" } },
    { params: { order: "old" } },
  ];

  return { paths, fallback: "blocking" };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let order = params?.order ?? "artist";
  let orderBy =
    order === "artist"
      ? [
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
        ]
      : {};

  let savedTabs = await prisma.tab.findMany({
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
      timestamp: true,
      rating: true,
    },
    orderBy,
  });

  if (order == "new") {
    savedTabs = savedTabs.reverse();
  }

  return {
    props: { allTabs: savedTabs },
    revalidate: 60,
  };
};

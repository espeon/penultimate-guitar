import TabLink from "@/components/home/tablink";
import { useGlobal } from "@/contexts/Global/context";
import { convertToTabLink } from "@/lib/conversion";
import prisma from "@/lib/prisma";
import { TabDto } from "@/models/models";
import { Song } from "@prisma/client";
import _ from "lodash";

import Head from "next/head";
import Link from "next/link";
import router, { useRouter } from "next/router";

type ListProps = {
  allTabs: TabDto[];
};

export default function Directory({ allTabs }: ListProps) {
  const { searchText, savedTabs } = useGlobal();
  const lowerSearchText = searchText.toLowerCase();
  const filteredTabs = _.uniqBy(
    allTabs.filter(
      (t) =>
        t.song.name.toLowerCase().includes(lowerSearchText) ||
        t.song.artist.toLowerCase().includes(lowerSearchText)
    ),
    (t: TabDto) => t.taburl
  );

  const multipleVersions: { [key: string]: boolean } = {};
  for (let tab of filteredTabs) {
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
      <div className="max-w-xl mx-auto flex flex-col gap-2 my-8">
        <div className="mx-x">
            {searchText.length > 0
              ? 'Searching for "' + searchText + '" in the directory'
              : "Directory"}
          <select
            className="p-2 rounded-md float-right"
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
          <div>
            {Object.keys(multipleVersions).length} songs, {allTabs.length} tabs
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

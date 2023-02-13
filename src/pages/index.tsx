import PinnedTabs from "@/components/pinnedtabs";
import RecentTabs from "@/components/recenttabs";
import Head from "next/head";
import type { NextPageWithLayout } from "./_app";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Penultimate Guitar</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PinnedTabs />
      <RecentTabs />
    </>
  );
};

export default Page;

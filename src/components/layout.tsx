import { useGlobal } from "@/contexts/Global/context";
import Header from "./header";
import LoadingSpinner from "./loadingspinner";
import Link from "next/link";
import { IoLogoGithub } from "react-icons/io";

export default function Layout({ children }: any) {
  const { globalLoading } = useGlobal();

  return (
    <>
      <Header />
      {globalLoading !== "" && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-black opacity-75 flex flex-col items-center justify-center">
          <LoadingSpinner />
          <h2 className="text-center text-white text-xl font-semibold text-opacity-100">
            Loading...
          </h2>
          <p className="w-1/3 text-center text-white text-opacity-100">
            {globalLoading}
          </p>
        </div>
      )}
      <main>{children}</main>
      <div className="flex justify-between m-auto max-w-2xl mt-8">
        <div className="flex gap-3">
          <Link href="https://github.com/espeon/penultimate-guitar">
            <IoLogoGithub className="text-2xl" />
          </Link>{" "}
          <Link href="https://notes.zachmanson.com/penultimate-guitar/">
            about
          </Link>
        </div>
        <div />
      </div>
    </>
  );
}

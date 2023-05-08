import Link from "next/link";
import SearchBox from "./search/searchbox";
<<<<<<< Updated upstream
=======
import ThemeSwitcher from "./shared/themes";
import PlainButton from "./shared/plainbutton";

import { TbGuitarPick, TbListSearch } from "react-icons/tb";
>>>>>>> Stashed changes

export default function Header() {
  return (
    <div className="no-print">
      <div className="flex justify-between m-auto max-w-2xl">
<<<<<<< Updated upstream
        <Link href="/">
          <h1 className="m-auto w-fit font-bold">Penultimate Guitar</h1>
=======
        <Link href="/" className="dark:text-blue-300">
          <TbGuitarPick size={"2.5rem"} />
>>>>>>> Stashed changes
        </Link>
        <div className="flex gap-6">
          <Link href="/directory">
<<<<<<< Updated upstream
            <span className="m-auto w-fit">Song Directory</span>
          </Link>
          <Link href="https://notes.zachmanson.com/penultimate-guitar">
            <span className="m-auto w-fit">About</span>
=======
            <PlainButton>
              <TbListSearch />
            </PlainButton>
>>>>>>> Stashed changes
          </Link>
        </div>
      </div>
      <SearchBox />
    </div>
  );
}

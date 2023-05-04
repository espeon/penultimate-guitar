import Link from "next/link";
import SearchBox from "./search/searchbox";
import ThemeSwitcher from "./shared/themes";
import PlainButton from "./shared/plainbutton";

import {TbGuitarPick, TbListSearch} from "react-icons/tb"

export default function Header() {
  return (
    <div className="no-print">
      <div className="flex justify-between m-auto max-w-2xl">
        <Link href="/" className="dark:text-blue-300">
          <TbGuitarPick size={"2.5rem"}/>
        </Link>
        <div className="flex gap-3">
          <Link href="/directory">
            <PlainButton children={<TbListSearch />}></PlainButton>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
      <SearchBox />
    </div>
  );
}

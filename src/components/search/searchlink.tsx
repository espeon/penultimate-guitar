import Link from "next/link";
import PlainButton from "../shared/plainbutton";

export default function SearchLink({
  tab_url,
  song_name,
  artist_name,
  rating,
  type,
  internal,
  best,
}: {
  tab_url: string;
  song_name: string;
  artist_name: string;
  rating: number;
  type: string;
  internal: boolean;
  best?: boolean;
}) {
  // const color: Record<string, string> = ;
  return (
    <Link
      href={`/${best ? "best" : "tab"}/${tab_url}`}
      className="w-full text-black dark:text-gray-200 no-underline hover:no-underline active:text-black dark:active:text-white"
      prefetch={false}
    >
      <PlainButton>
        <div className={"flex justify-between"}>
          <div className={"flex flex-col " + (internal ? "" : "italic")}>
            <div className="font-bold">{song_name}</div>
            <div className="">{artist_name}</div>
          </div>

          <div className="flex flex-col gap-1 items-end justify-between">
            <div
              className={
                `w-fit rounded px-1 opacity-70 text-white ` +
                {
                  ukulele: "bg-purple-700",
                  chords: "bg-blue-700",
                  tabs: "bg-green-700",
                  bass: "bg-red-700",
                  drums: "bg-yellow-700",
                }[type]
              }
            >
              {type[0].toUpperCase() + type.slice(1)}
            </div>
            <div className="text-gray-400 min-w-20">
              {!Math.round(rating) || `${Math.round(rating * 100) / 100} / 5`}
            </div>
          </div>
        </div>
        <div className="flex justify-between"></div>
      </PlainButton>
    </Link>
  );
}

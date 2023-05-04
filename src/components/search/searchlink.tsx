import { SearchResult } from "@/models/models";
import Link from "next/link";
import PlainButton from "../shared/plainbutton";

type SearchLinkProps = SearchResult;

export default function SearchLink({
  tab_url,
  song_name,
  artist_name,
  rating,
  type,
}: SearchLinkProps) {
  return (
    <Link
      href={`/tab/${tab_url}`}
      className="w-full text-black dark:text-white no-underline hover:no-underline active:text-black py-4 px-6 bg-slate-700 rounded-lg"
      prefetch={false}
    >
        <div className="flex justify-between">
          <div>
            <span className="font-bold">{song_name}</span> - {artist_name}
          </div>
          <div></div>
        </div>
        <div className="flex justify-between">
          <div>
            <p>
              {!Math.round(rating) ||
                `Rating: ${Math.round(rating * 100) / 100} / 5`}
            </p>
          </div>
          <div>
            <p>{type}</p>
          </div>
        </div>
    </Link>
  );
}

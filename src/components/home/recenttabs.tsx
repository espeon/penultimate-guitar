import { TabLinkDto } from "@/models/models";
import { useEffect, useState } from "react";
import TabLink from "./tablink";
import { Disclosure } from "@headlessui/react";
import { MdChevronRight } from "react-icons/md";

export default function RecentTabs() {
  const [recents, setRecents] = useState<TabLinkDto[]>([]);

  useEffect(() => {
    const savedRecents: any = JSON.parse(
      localStorage?.getItem("recents") || "[]"
    );
    if (Array.isArray(savedRecents)) {
      setRecents(savedRecents);
    } else {
      // convert to new format
      const arrayRecents = Object.keys(savedRecents).map((r) => ({
        taburl: r,
        name: savedRecents[r].name,
        artist: savedRecents[r].artist,
        version: savedRecents[r].version,
      }));

      setRecents(arrayRecents);
      localStorage.setItem("recents", JSON.stringify(arrayRecents));
    }
  }, []);

  return (
    <div>
      {Object.keys(recents).length > 0 ? (
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <Disclosure.Button className="py-2 inline-flex">
                <MdChevronRight className={open ? 'rotate-90 transition-transform ease-in-out text-2xl mt-[0.35rem]' : 'transition-transform ease-in-out text-2xl mt-[0.35rem]'} /><span className="text-center text-2xl">Recent Tabs</span>
              </Disclosure.Button>
              <Disclosure.Panel className="flex flex-col gap-2 mt-2">
                {recents
                  .slice(0, 10)
                  .filter((r) => r.name && r.artist)
                  .map((r: TabLinkDto, i) => (
                    <TabLink
                      key={i}
                      tablink={{ ...r }}
                      recent={true}
                    />
                  ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ) : (
        <p className="text-center">Saved and recent tabs will show up here!</p>
      )}
    </div>
  );
}

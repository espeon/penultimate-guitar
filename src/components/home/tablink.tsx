import { useGlobal } from "@/contexts/Global/context";
import { TabLinkDto } from "@/models/models";
import Link from "next/link";
import { useState } from "react";
import SaveDialog from "../dialog/savedialog";
import PlainButton from "../shared/plainbutton";

type TabLinkProps = {
  tablink: TabLinkDto;
  recent?: boolean;
};
export default function TabLink({ tablink, recent }: TabLinkProps) {
  const { removeSavedTab, isSaved, savedTabs } = useGlobal();
  const [saveDialogActive, setSaveDialogActive] = useState(false);

  const handleSave = () => {
    if (!recent && isSaved(tablink)) {
      removeSavedTab(tablink);
    } else {
      setSaveDialogActive(true);
    }
  };

  // soooo hacky aaa
  if (tablink.taburl.includes("-tab")) tablink.type = "Tab";
  else if (tablink.taburl.includes("-chord")) tablink.type = "Chords";
  else if (tablink.taburl.includes("-ukulele")) tablink.type = "Ukulele";
  else if (tablink.taburl.includes("-bass")) tablink.type = "Bass Tabs";

  return (
    <>
      <div className="w-full flex mx-auto justify-between gap-2">
        <Link
          href={`/tab/${tablink.taburl}`}
          className="w-full text-black no-underline hover:no-underline active:text-black"
          prefetch={false}
        >
<<<<<<< Updated upstream
          <PlainButton>
            <span className="font-bold">{tablink.name}</span> - {tablink.artist}
            {tablink.version && (
              <span className="font-light text-xs">
                {" "}
                {tablink.type && `(${tablink.type})`} (v{tablink.version})
              </span>
            )}
          </PlainButton>
        </Link>
        <PlainButton onClick={handleSave}>
          <div className="flex items-center h-full">{recent ? "💾" : "❌"}</div>
=======
          <span className="font-medium">{tablink.name}</span> - {tablink.artist}
          {tablink.version && (
            <span className="font-light text-sm">
              {" "}
              {tablink.type && `(${tablink.type})`} (v{tablink.version})
            </span>
          )}
        </Link>
        <PlainButton onClick={handleSave}>
          <div className="flex items-center h-full">
            {savedTabs.find(({ taburl }) => taburl === tablink.taburl) ? (
              <TbHeartFilled />
            ) : (
              <TbHeart />
            )}
          </div>
>>>>>>> Stashed changes
        </PlainButton>
      </div>
      <SaveDialog
        isOpen={saveDialogActive}
        setIsOpen={setSaveDialogActive}
        tab={tablink}
      />
    </>
  );
}

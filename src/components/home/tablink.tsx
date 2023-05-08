import { useGlobal } from "@/contexts/Global/context";
import { TabLinkDto } from "@/models/models";
import Link from "next/link";
import { useState } from "react";
import SaveDialog from "../dialog/savedialog";
import PlainButton from "../shared/plainbutton";
import { TbHeartFilled, TbHeart } from "react-icons/tb";

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
      <div className="w-full text-black dark:text-white no-underline hover:no-underline active:text-black py-3 px-6 dark:bg-slate-700 bg-slate-300 dark:hover:bg-slate-600 transition-all rounded-lg flex">
        <Link
          href={`/tab/${tablink.taburl}`}
          className="w-full h-full pt-2 text-black dark:text-slate-200 no-underline hover:no-underline active:text-black"
          prefetch={false}
        >
            <span className="font-medium">{tablink.name}</span> - {tablink.artist}
            {tablink.version && (
              <span className="font-light text-sm">
                {" "}
                {tablink.type && `(${tablink.type})`} (v{tablink.version})
              </span>
            )}
        </Link>
        <PlainButton onClick={handleSave}>
          <div className="flex items-center h-full">{!tablink.saved ? <TbHeart/> : <TbHeartFilled />}</div>
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
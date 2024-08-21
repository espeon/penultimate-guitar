import { useGlobal } from "@/contexts/Global/context";
import { TabLinkDto } from "@/models/models";
import Link from "next/link";
import { useState } from "react";
import SaveDialog from "../dialog/savedialog";
import PlainButton from "../shared/plainbutton";
import useSavedTabs from "@/hooks/useSavedTabs";
import { BookmarkIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function TabLink({
  tablink,
  folder,
  recent,
}: {
  tablink: TabLinkDto;
  folder?: string;
  recent?: boolean;
}) {
  const { removeSavedTab, isSaved } = useSavedTabs();
  const [saveDialogActive, setSaveDialogActive] = useState(false);

  const handleSave = () => {
    if (folder && !recent && isSaved(tablink)) {
      removeSavedTab(tablink, folder);
    } else {
      setSaveDialogActive(true);
    }
  };

  return (
    <>
      <div
        className="w-full flex mx-auto justify-between gap-2"
        onMouseOver={(e) => e.stopPropagation()}
      >
        <Link
          href={`/tab/${tablink.taburl}`}
          className="w-full text-black no-underline hover:no-underline active:text-black"
          prefetch={false}
        >
          <PlainButton>
            <span className="font-bold text-sm">{tablink.name}</span> -{" "}
            {tablink.artist}
            {tablink.version && (
              <span className="font-light text-xs">
                {" "}
                {tablink.type && `(${tablink.type})`} (v{tablink.version})
              </span>
            )}
          </PlainButton>
        </Link>
        <PlainButton onClick={handleSave}>
          <div className="flex items-center h-full w-4">
            {recent || !folder ? (
              <BookmarkIcon className="w-full h-full" />
            ) : (
              <XMarkIcon className="w-full h-full" />
            )}
          </div>
        </PlainButton>
      </div>
      {saveDialogActive && (
        <SaveDialog
          isOpen={saveDialogActive}
          setIsOpen={setSaveDialogActive}
          tab={tablink}
        />
      )}
    </>
  );
}

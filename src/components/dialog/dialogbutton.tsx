import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
} from "react";

type DialogButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
};

export default function DialogButton({
  onClick,
  disabled,
  children,
}: DialogButtonProps): JSX.Element {
  return (
    <>
      <button
        disabled={disabled}
        onClick={onClick}
        className={`pt-3 inline-flex items-center dark:bg-slate-700 bg-slate-300 text-gray-800 hover:text-gray-80  dark:hover:bg-slate-500 dark:text-white dark:hover:text-white rounded-lg p-3 transition-all duration-300 ease-in-out"
       disabled ? "text-slate-400" : "hover:shadow-md"
        }`}
      >
        {children}
      </button>
    </>
  );
}

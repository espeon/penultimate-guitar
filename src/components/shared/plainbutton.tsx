import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from "react";

export default function PlainButton(props: {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal;
  onClick?: () => void;
}) {
  return (
    <div
      className="pt-3 inline-flex items-center dark:bg-slate-700 bg-slate-300 text-gray-800 hover:text-gray-80  dark:hover:bg-slate-500 dark:text-white dark:hover:text-white rounded-lg p-3 transition-all duration-300 ease-in-out"
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

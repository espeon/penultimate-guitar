type ToolbarButton = {
  onClick?: () => void;
  children: string | JSX.Element;
  disabled?: boolean;
};

export default function ToolbarButton({
  onClick,
  children,
  disabled,
}: ToolbarButton) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={getToolbarButtonStyle(!!disabled)}
    >
      {children}
    </button>
  );
}

export const getToolbarButtonStyle = (disabled: boolean) => `
pt-3 inline-flex items-center dark:bg-slate-700 bg-slate-300 text-gray-800 dark:text-white rounded-lg p-3 h-9 w-9 transition-all duration-300 ease-in-out
  ${
    disabled
      ? "opacity-50"
      : "dark:hover:text-white hover:text-gray-80  dark:hover:bg-slate-600 "
  }`;

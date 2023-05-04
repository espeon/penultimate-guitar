import React from 'react';
import { useTheme } from 'next-themes'
import { IoMdMoon, IoMdSunny } from 'react-icons/io'

const themeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  console.log(theme);
  const DarkLightIcon = theme == "dark" ? IoMdMoon : IoMdSunny
  return <button
  className="pt-3 inline-flex items-center dark:bg-slate-700 bg-slate-300 text-gray-800 hover:text-gray-80  dark:hover:bg-slate-600 dark:text-white dark:hover:text-white rounded-lg p-3 transition-all duration-300 ease-in-out" aria-label="Theme Switcher"
  onClick={() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }}>
    <DarkLightIcon />
  </button>
}

export default themeSwitcher;
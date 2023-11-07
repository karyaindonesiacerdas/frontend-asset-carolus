import * as SwitchPrimitive from '@radix-ui/react-switch'
import { MoonIcon, SunIcon } from '@heroicons/react/solid'

import { ThemeContext } from './themeContext'

/* eslint-disable-next-line */

export function ToggleDarkMode() {
  const { theme, setTheme } = useTheme()

  return (
    <SwitchPrimitive.Root
      className="w-12 h-6 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 radix-state-checked:bg-gray-800 transition-all"
      checked={theme === 'dark'}
      defaultChecked={theme === 'dark'}
      onCheckedChange={isChecked => setTheme(isChecked ? 'dark' : 'light')}
    >
      <SwitchPrimitive.Thumb className="h-5 w-5 rounded-full bg-primary-500 shadow shadow-primary-500/30 translate-x-0.5 radix-state-checked:translate-x-[25px] transition-all flex items-center justify-center">
        {theme === 'dark' ? (
          <MoonIcon className="w-4 h-4 text-gray-900 hover:animate-spin" />
        ) : (
          <SunIcon className="w-4 h-4 text-gray-900 hover:animate-spin" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export default ToggleDarkMode

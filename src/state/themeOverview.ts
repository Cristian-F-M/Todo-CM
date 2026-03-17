import { create } from 'zustand'
import type { ThemeParsedObject } from '@/types/theme'

interface ThemeOverviewStore {
	themeToSee: ThemeParsedObject | null
	setThemeToSee: (theme: ThemeParsedObject | null) => void
}

export const useThemeOverview = create<ThemeOverviewStore>()((set) => ({
	themeToSee: null,
	setThemeToSee: (theme) => set({ themeToSee: theme })
}))
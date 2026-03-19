import { create } from 'zustand'
import type { RealeseData } from '@/types/realese'

interface RealeseState {
	data: RealeseData | null
	progress: number | null
	setData: (data: RealeseData) => void
	setProgress: (progress: number | null) => void
}

export const useRealese = create<RealeseState>((set) => ({
	data: null,
	progress: null,
	setData: (data) => set({ data }),
	setProgress: (progress) => set({ progress })
}))
import { create } from 'zustand'
import type { ReleaseData } from '@/types/release'

interface ReleaseState {
	data: ReleaseData | null
	progress: number | null
	setData: (data: ReleaseData) => void
	setProgress: (progress: number | null) => void
}

export const useRelease = create<ReleaseState>((set) => ({
	data: null,
	progress: null,
	setData: (data) => set({ data }),
	setProgress: (progress) => set({ progress })
}))
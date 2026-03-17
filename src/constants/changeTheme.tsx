import uuid from 'react-native-uuid'
import { ContextMenu } from '@/components/context-menu/ContextMenu'
import { ThemeOverview } from '@/components/theme/ThemeOverview'
import { useTheme } from '@/state/theme'
import { useThemeOverview } from '@/state/themeOverview'
import type { ConfigRowModalWithListProps } from '@/types/config'
import type { ContextMenuItemData } from '@/types/contextMenu'
import type { ThemeParsedObject } from '@/types/theme'
import { removeTheme } from '@/utils/theme'
import { THEME_OVERVIEW_MENU_ACTIONS } from './contextMenu'

export const useConfigModal = () => {
	const { themes, theme, setTheme } = useTheme()
	const themeKeys = Object.values(themes).map(() => uuid.v4())
	const { setThemeToSee } = useThemeOverview()

	const ConfigModalConfig = {
		flatList: true,
		flatListProps: {
			data: Object.values(themes),
			renderItem: ({ item }: { item: ThemeParsedObject }) => {
				const isSelected = item.id === theme

				const handleSetTheme = (contextMenuItem: ContextMenuItemData) => {
					if (contextMenuItem.id === 'see-theme') {
						setThemeToSee(item)
					}
					if (contextMenuItem.id === 'select-theme') setTheme(item.id)
					if (contextMenuItem.id === 'delete-theme') {
						removeTheme(item.id)
					}
				}
				let actions = THEME_OVERVIEW_MENU_ACTIONS.filter(
					({ id }) => id !== 'edit-theme'
				)

				if (item.scope === 'system')
					actions = actions.filter(
						({ id }) => !['delete-theme', 'edit-theme'].includes(id)
					)

				if (isSelected)
					actions = actions.filter(
						({ id }) => id !== 'select-theme' && id !== 'delete-theme'
					)

				return (
					<ContextMenu
						items={actions}
						onItemPress={handleSetTheme}
						title={item.name}
					>
						<ThemeOverview
							theme={item}
							themeKey={item.id}
							isSelected={isSelected}
						/>
					</ContextMenu>
				)
			},
			keyExtractor: (_: unknown, index: number) => themeKeys[index],

			initialNumToRender: 6,
			maxToRenderPerBatch: 4,
			windowSize: 3,
			removeClippedSubviews: true,
			contentContainerStyle: { paddingBottom: 20 },
			extraData: themes
		}
	} satisfies ConfigRowModalWithListProps

	return { config: ConfigModalConfig }
}
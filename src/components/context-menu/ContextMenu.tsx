import * as Haptics from 'expo-haptics'
import React, { useCallback, useMemo, useState } from 'react'
import {
	Dimensions,
	FlatList,
	type GestureResponderEvent,
	type LayoutChangeEvent,
	Modal,
	Pressable,
	Text,
	View,
	type ViewProps
} from 'react-native'
import { twMerge } from 'tailwind-merge'
import type { ContextMenuItemData } from '@/types/contextMenu'
import { removeKeysFromObject } from '@/utils'
import { useThemeStyles } from '@/utils/theme'
import { ContextMenuItem } from './ContextMenuItem'

export const CONTEXT_MENU_OFFSET = 12

interface ContextMenuProps extends ViewProps {
	items: ContextMenuItemData[]
	onItemPress?: (item: ContextMenuItemData, index: number) => void
	showOnLongPress?: boolean
	onTriggerPress?: () => void
	title?: string
}

const DEFAULT_META = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}

export function ContextMenu({
	children,
	items,
	showOnLongPress = false,
	onTriggerPress,
	onItemPress,
	className,
	style,
	title,
	...props
}: ContextMenuProps) {
	const themeStyles = useThemeStyles()
	const [isShowed, setIsShowed] = useState(false)
	const [triggerMeta, setTriggerMeta] =
		useState<Partial<typeof DEFAULT_META>>(DEFAULT_META)
	const [contextMenuMeta, setContextMenuMeta] = useState(DEFAULT_META)
	const onContextMenuLayout = useCallback(
		(event: LayoutChangeEvent) => {
			const { width, height } = event.nativeEvent.layout
			const {
				x: pageX,
				y: pageY,
				height: triggerHeight,
				width: triggerWidth
			} = triggerMeta

			if (!pageX || !pageY || !triggerHeight || !triggerWidth) return

			const { width: screenWidth, height: screenHeight } =
				Dimensions.get('window')

			const isOutAtLeft = pageX - width / 2 <= 0
			const isOutAtRight = pageX + width / 2 >= screenWidth
			const isOutAtTop = pageY - height <= 0
			const isOutAtBottom = pageY + height >= screenHeight

			let x = pageX - width / 2
			let y = pageY - height - CONTEXT_MENU_OFFSET

			if (isOutAtLeft) x = 5
			if (isOutAtRight) x = screenWidth - width - 5
			if (isOutAtTop) y = triggerHeight + 5 + CONTEXT_MENU_OFFSET * 2
			if (isOutAtBottom) y = pageY - height - CONTEXT_MENU_OFFSET

			setContextMenuMeta({ x, y, width, height })
		},
		[triggerMeta]
	)

	const handleShowMenu = useCallback(() => {
		setIsShowed(true)
	}, [])

	const handleHideMenu = useCallback(() => {
		setIsShowed(false)
	}, [])

	const handleTriggerPress = useCallback(
		async (event: GestureResponderEvent) => {
			const { pageX: x, pageY: y } = event.nativeEvent
			setTriggerMeta((prev) => ({ ...prev, x, y }))
			if (showOnLongPress)
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
			if (onTriggerPress) onTriggerPress()

			handleShowMenu()
		},
		[onTriggerPress, handleShowMenu, showOnLongPress]
	)

	const onPressKey = showOnLongPress ? 'onLongPress' : 'onPress'

	const [newChildren, childProps] = useMemo(() => {
		const child = React.Children.only(children)

		if (React.isValidElement(child)) {
			const newChild = React.cloneElement(child, {})
			const childProps = child.props as Record<string, unknown>
			const newProps = removeKeysFromObject(childProps, [
				'onPress',
				'onLongPress',
				'onLayout'
			])
			return [newChild, newProps]
		}
		return [children, {}]
	}, [children])

	return (
		<>
			<Pressable
				onLayout={(event) => {
					const { width, height } = event.nativeEvent.layout
					setTriggerMeta((prev) => ({ ...prev, width, height }))
				}}
				{...{ [onPressKey]: handleTriggerPress }}
				{...childProps}
			>
				<View className="z-50" pointerEvents="none">
					{newChildren}
				</View>
			</Pressable>
			<Modal
				transparent
				visible={isShowed}
				animationType="fade"
				onRequestClose={handleHideMenu}
				onDismiss={handleHideMenu}
			>
				<Pressable onPress={handleHideMenu} className="w-full h-full">
					<View
						onLayout={onContextMenuLayout}
						className={twMerge(
							'absolute rounded-lg max-w-44 shadow-lg overflow-hidden',
							className
						)}
						style={[
							{
								top: contextMenuMeta.y,
								left: contextMenuMeta.x,
								backgroundColor: themeStyles.surfaceSoft(),
								borderWidth: 1,
								borderColor: themeStyles.border()
							},
							style
						]}
						{...props}
					>
						{title && (
							<>
								<View className="w-full px-4 py-1 max-h-10">
									<Text
										className="text-center text-xs"
										style={{
											color: themeStyles.textMuted()
										}}
									>
										{title}
									</Text>
								</View>
								<View
									className="w-full"
									style={{
										height: 1,
										backgroundColor: themeStyles.border()
									}}
								/>
							</>
						)}

						<FlatList
							data={items}
							keyExtractor={({ id }) => id}
							ItemSeparatorComponent={() => (
								<View
									className="w-full"
									style={{
										height: 1,
										backgroundColor: themeStyles.border()
									}}
								/>
							)}
							renderItem={({ item, index }) => {
								function onPress() {
									item.onPress?.()
									handleHideMenu()
									onItemPress?.(item, index)
								}

								const complexItem = Object.assign({}, item, {
									onPress
								})

								return <ContextMenuItem item={complexItem} />
							}}
						/>

						{items.length <= 0 && (
							<View className="w-full px-4 py-2">
								<Text
									className="text-center text-xs"
									style={{
										color: themeStyles.textMuted()
									}}
								>
									No hay acciones
								</Text>
							</View>
						)}
					</View>
				</Pressable>
			</Modal>
		</>
	)
}
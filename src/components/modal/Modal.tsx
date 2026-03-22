import type React from 'react'
import { useEffect, useMemo } from 'react'
import { Keyboard } from 'react-native'
import { Modalize, type ModalizeProps } from 'react-native-modalize'
import { Portal } from 'react-native-portalize'
import Animated, { useSharedValue } from 'react-native-reanimated'
import { useModal } from '@/state/modal'
import { useThemeStyles } from '@/utils/theme'

interface ModalProps extends ModalizeProps {
	modalRef: React.RefObject<Modalize | null>
	children: React.ReactNode
}

export function Modal({
	modalRef,
	children,
	modalStyle: mStyle,
	...props
}: ModalProps) {
	const { setItem } = useModal()
	const paddingBottom = useSharedValue(0)
	const themeStyles = useThemeStyles()
	const modalStyle = useMemo<ModalizeProps['modalStyle']>(
		() => [
			{
				backgroundColor: themeStyles.background(),
				// paddingBottom: 20,
				paddingHorizontal: 5,
				paddingBottom: paddingBottom.value
			},
			mStyle
		],
		[mStyle, paddingBottom, themeStyles]
	)

	useEffect(() => {
		const subsKeyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
			paddingBottom.value = Keyboard.metrics()?.height ?? 20
		})

		const subsKeyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
			paddingBottom.value = 20
		})

		return () => {
			subsKeyboardDidShow.remove()
			subsKeyboardDidHide.remove()
		}
	}, [paddingBottom])

	return (
		<Portal>
			<Modalize
				scrollViewProps={{
					keyboardShouldPersistTaps: 'handled'
				}}
				ref={modalRef}
				modalStyle={modalStyle}
				adjustToContentHeight
				onClose={() => {
					setItem(null)
				}}
				{...props}
			>
				{!props.flatListProps && (
					<Animated.View
						style={{
							paddingBottom
						}}
					>
						{children}
					</Animated.View>
				)}
			</Modalize>
		</Portal>
	)
}
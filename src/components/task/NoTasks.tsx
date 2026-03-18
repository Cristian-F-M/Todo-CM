import { IconFolder } from '@tabler/icons-react-native'
import { useCallback, useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { StyledPressable } from '@/components/layout/StyledPressable'
import { useModal } from '@/state/modal'
import { useThemeStyles } from '@/utils/theme'

export function NoTasks({ thereAreTasks }: { thereAreTasks: boolean }) {
	const { openModal } = useModal()
	const themeStyles = useThemeStyles()
	const opacity = useSharedValue(0)

	const handleClickOpenModal = useCallback(() => {
		openModal('task')
	}, [openModal])

	useEffect(() => {
		const opts = { duration: 800 }

		if (thereAreTasks) opacity.value = withSpring(0, opts)
		else opacity.value = withSpring(1, opts)
	}, [thereAreTasks, opacity])

	return (
		<Animated.View
			className="items-center justify-center mt-24 w-4/5 mx-auto"
			style={{
				opacity: opacity
			}}
		>
			<Pressable
				className="flex-row items-center justify-center rounded-full p-7"
				style={{
					backgroundColor: themeStyles.surfaceSoft()
				}}
			>
				<IconFolder width={50} height={50} stroke={themeStyles.primary()} />
			</Pressable>
			<Text
				className="text-3xl mt-3 font-semibold"
				style={{
					color: themeStyles.textPrimary()
				}}
			>
				No hay tasks
			</Text>
			<Text
				className="mt-1"
				style={{
					color: themeStyles.textMuted()
				}}
			>
				Esta carpeta está vacía
			</Text>
			<StyledPressable
				text="Agregar primera tarea"
				className="mt-8"
				onPress={handleClickOpenModal}
			/>
		</Animated.View>
	)
}
import { IconFolderPlus } from '@tabler/icons-react-native'
import { useCallback, useEffect } from 'react'
import { Pressable, Text } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { StyledPressable } from '@/components/layout/StyledPressable'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import { useThemeStyles } from '@/utils/theme'

export function NoFolders() {
	const { openModal } = useModal()
	const themeStyles = useThemeStyles()
	const opacity = useSharedValue(0)
	const { folders } = useFolder()
	const thereAreFolders = folders.length > 0

	const handleClickOpenModal = useCallback(() => {
		openModal('folder')
	}, [openModal])

	useEffect(() => {
		const opts = { duration: 800 }

		if (thereAreFolders) opacity.value = withSpring(0, opts)
		else opacity.value = withSpring(1, opts)
	}, [thereAreFolders, opacity])

	return (
		<Animated.View
			className="items-center mt-0 w-11/12 mx-auto py-10 px-4 rounded-lg"
			style={{
				opacity
			}}
		>
			<Pressable
				className="flex-row items-center justify-center rounded-full p-7"
				style={{
					backgroundColor: themeStyles.surface()
				}}
			>
				<IconFolderPlus width={50} height={50} stroke={themeStyles.primary()} />
			</Pressable>
			<Text
				className="text-3xl mt-3 font-semibold"
				style={{
					color: themeStyles.textPrimary()
				}}
			>
				No hay carpetas
			</Text>
			<Text
				className="mt-1 text-center"
				style={{
					color: themeStyles.textMuted()
				}}
			>
				Crea tu primera carpeta para comenzar a organizar tus tareas
			</Text>
			<StyledPressable
				text="Agregar primera carpeta"
				className="mt-8"
				onPress={handleClickOpenModal}
			/>
		</Animated.View>
	)
}
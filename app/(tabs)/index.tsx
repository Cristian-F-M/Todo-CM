import { IconDownload } from '@tabler/icons-react-native'
import { useEffect } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { FolderItem } from '@/components/folder/FolderItem'
import { NoFolders } from '@/components/folder/NoFolders'
import { BackgroundIcon } from '@/components/layout/BackgroundIcon'
import { FloatingDownload } from '@/components/layout/FloatingDownload'
import { Header } from '@/components/layout/Header'
import { Screen } from '@/components/layout/Screen'
import useReleaseHook from '@/hooks/useRelease'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import { useThemeStyles } from '@/utils/theme'

export default function Index() {
	const { folders } = useFolder()
	const opacity = useSharedValue(1)
	const themeStyles = useThemeStyles()
	const { needUpdate } = useReleaseHook()
	const { openModal } = useModal()

	const thereIsFolders = folders.length > 0

	useEffect(() => {
		const opts = { duration: 800 }

		if (thereIsFolders) opacity.value = withSpring(1, opts)
		else opacity.value = withSpring(0, opts)
	}, [thereIsFolders, opacity])

	return (
		<Screen safeArea={true}>
			{thereIsFolders && <BackgroundIcon />}
			<Header />
			{needUpdate && (
				<Pressable
					onPress={() => openModal('update')}
					className="ml-auto mr-4 p-2 rounded-full justify-center items-center"
					style={{
						backgroundColor: themeStyles.surface(),
						borderWidth: 2,
						borderColor: themeStyles.border()
					}}
				>
					<View className="mb-px">
						<IconDownload size={20} color={themeStyles.primary()} />
					</View>
				</Pressable>
			)}

			<Animated.View style={{ opacity }}>
				{thereIsFolders && (
					<View className="mt-4 items-center justify-center w-11/12 mx-auto mb-6">
						<FlatList
							className="w-full gap-y-2"
							data={folders}
							renderItem={({ item }) => <FolderItem folder={item} />}
							keyExtractor={(item) => item.id}
						/>
					</View>
				)}
			</Animated.View>

			{!thereIsFolders && <NoFolders />}

			<FloatingDownload />
		</Screen>
	)
}
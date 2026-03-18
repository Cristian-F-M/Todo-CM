import { useEffect } from 'react'
import { FlatList, View } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { FolderItem } from '@/components/folder/FolderItem'
import { NoFolders } from '@/components/folder/NoFolders'
import { BackgroundIcon } from '@/components/layout/BackgroundIcon'
import { Header } from '@/components/layout/Header'
import { Screen } from '@/components/layout/Screen'
import useFolder from '@/state/Folder'

export default function Index() {
	const { folders } = useFolder()
	const opacity = useSharedValue(1)

	const thereIsFolders = folders.length > 0

	useEffect(() => {
		const opts = { duration: 800 }

		if (thereIsFolders) opacity.value = withSpring(1, opts)
		else opacity.value = withSpring(0, opts)
	}, [thereIsFolders, opacity])

	return (
		<Screen safeArea={true}>
			{thereIsFolders && <BackgroundIcon />}
			<Animated.View style={{ opacity }}>
				<Header />

				{thereIsFolders && (
					<View className="mt-10 items-center justify-center w-11/12 mx-auto mb-6">
						<FlatList
							className="w-full gap-y-2"
							data={folders}
							renderItem={({ item }) => <FolderItem folder={item} />}
							keyExtractor={(item) => item.id}
						/>
					</View>
				)}
			</Animated.View>

			{!thereIsFolders && <NoFolders thereAreFolders={thereIsFolders} />}
		</Screen>
	)
}
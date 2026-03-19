import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useEffect } from 'react'
import { Image, Pressable, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { Portal } from 'react-native-portalize'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import LogoCMSmallWhite from '@/assets/logo-cm-small-white.png'
import { useModal } from '@/state/modal'
import { useRealese } from '@/state/realese'
import { useThemeStyles } from '@/utils/theme'

export function FloatingDownload() {
	const tabBarHeight = useBottomTabBarHeight()
	const themeStyles = useThemeStyles()
	const { progress } = useRealese()
	const scale = useSharedValue(0.9)
	const opacity = useSharedValue(0)
	const { openModal } = useModal()

	useEffect(() => {
		const opts = { duration: 800 }

		if (progress === null) {
			setTimeout(() => {
				opacity.value = withSpring(0, opts)
				scale.value = withSpring(0.9, opts)
			}, 1000)
			return
		}
		if (scale.value === 1 || opacity.value === 1) return

		scale.value = withSpring(1, opts)
		opacity.value = withSpring(1, opts)
	}, [progress, opacity, scale])

	if (progress === null) return null

	return (
		<Portal>
			<Animated.View
				className="absolute w-16 h-16 right-5 rounded-full justify-center items-center"
				style={{
					opacity,
					transform: [{ scale }],
					bottom: tabBarHeight + 20,
					borderWidth: 5,
					borderColor: themeStyles.primary(),
					borderRadius: 9999
				}}
			>
				<Pressable onPress={() => openModal('update')}>
					<AnimatedCircularProgress
						size={54}
						width={6}
						fill={progress ?? 0}
						rotation={0}
						tintColor={themeStyles.primary()}
						backgroundColor={themeStyles.surfaceSoft()}
					>
						{() => (
							<View className="h-full w-full rounded-full bg-white justify-center items-center relative">
								<View className="absolute inset-0 justify-center items-center bg-[#111827]">
									<Image source={LogoCMSmallWhite} className="w-12 h-12" />
								</View>
							</View>
						)}
					</AnimatedCircularProgress>
				</Pressable>
			</Animated.View>
		</Portal>
	)
}
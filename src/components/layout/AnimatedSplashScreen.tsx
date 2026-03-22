import { useCallback, useImperativeHandle, useState } from 'react'
import { Portal } from 'react-native-portalize'
import Animated, {
	cancelAnimation,
	type SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming
} from 'react-native-reanimated'
import { Path, Svg, type SvgProps } from 'react-native-svg'
import { scheduleOnRN } from 'react-native-worklets'
import { useThemeStyles } from '@/utils/theme'

export interface AnimatedSplashScreenHandle {
	startAnimation: () => void
	stopAnimation: () => void
	resetAnimation: () => void
	hide: () => void
}

interface AnimatedSplashScreenProps extends SvgProps {
	ref?: React.RefObject<AnimatedSplashScreenHandle | null>
	onAnimatedEnd?: () => void
}

const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function AnimatedSplashScreen({
	ref,
	onAnimatedEnd,
	...props
}: AnimatedSplashScreenProps) {
	const themeStyles = useThemeStyles()
	const [wasShowed, setWasShowed] = useState(false)
	let animatedEndtimeOut: NodeJS.Timeout | undefined

	const scale = useSharedValue(0.9)
	const opacity = useSharedValue(1)

	const t1 = useSharedValue(50)
	const t2 = useSharedValue(50)
	const t3 = useSharedValue(50)
	const t4 = useSharedValue(50)

	const o1 = useSharedValue(0)
	const o2 = useSharedValue(0)
	const o3 = useSharedValue(0)
	const o4 = useSharedValue(0)

	const getStyles = useCallback(
		(translateY: SharedValue<number>, opacity: SharedValue<number>) => {
			return useAnimatedStyle(() => ({
				transform: [{ translateY: translateY.value }],
				opacity: opacity.value
			}))
		},
		[]
	)

	const startAnimation = useCallback(() => {
		t1.value = withDelay(0, withSpring(0))
		o1.value = withDelay(0, withTiming(1, { duration: 400 }))

		t2.value = withDelay(150, withSpring(0))
		o2.value = withDelay(150, withTiming(1, { duration: 400 }))

		t3.value = withDelay(300, withSpring(0))
		o3.value = withDelay(300, withTiming(1, { duration: 400 }))

		t4.value = withDelay(450, withSpring(0))
		o4.value = withDelay(450, withTiming(1, { duration: 400 }))

		scale.value = withDelay(
			700,
			withSpring(1, {}, (finished) => {
				if (finished) scheduleOnRN(handleAnimationEnd)
			})
		)
	}, [])

	const stopAnimation = useCallback(() => {
		cancelAnimation(t1)
		cancelAnimation(t2)
		cancelAnimation(t3)
		cancelAnimation(t4)
		cancelAnimation(o1)
		cancelAnimation(o2)
		cancelAnimation(o3)
		cancelAnimation(o4)
		cancelAnimation(scale)
		clearTimeout(animatedEndtimeOut)
	}, [])

	const resetAnimation = useCallback(() => {
		stopAnimation()

		t1.value = 50
		t2.value = 50
		t3.value = 50
		t4.value = 50

		o1.value = 0
		o2.value = 0
		o3.value = 0
		o4.value = 0

		scale.value = 0.9
	}, [])

	const hide = useCallback(() => {
		setWasShowed(true)
		opacity.value = withTiming(0)
	}, [])

	const handleAnimationEnd = useCallback(() => {
		if (onAnimatedEnd) onAnimatedEnd()
	}, [])

	useImperativeHandle(
		ref,
		() => ({
			startAnimation,
			stopAnimation,
			resetAnimation,
			hide
		}),
		[]
	)

	return (
		<Portal>
			<Animated.View
				pointerEvents={wasShowed ? 'none' : 'auto'}
				className="absolute inset-0 w-full h-full items-center justify-center"
				style={{
					backgroundColor: themeStyles.background(),
					opacity: opacity
				}}
			>
				<Animated.View
					style={{
						transform: [{ scale: scale }]
					}}
				>
					<Svg
						width={180}
						height={160}
						color={themeStyles.textPrimary()}
						viewBox="0 0 344 308"
						{...props}
					>
						<AnimatedPath
							d="M344 32V254V255.5L302.5 223V117.5L238 168.5V240.5L198 208.5V150L344 32Z"
							fill="currentColor"
							animatedProps={getStyles(t1, o1)}
						/>

						<AnimatedPath
							d="M175 166.5L103 110V161L174.5 217.127L175 166.5Z"
							fill="currentColor"
							animatedProps={getStyles(t2, o2)}
						/>
						<AnimatedPath
							d="M69.5 308L0 253V203L102 282.5L69.5 308Z"
							fill="currentColor"
							animatedProps={getStyles(t3, o3)}
						/>
						<AnimatedPath
							d="M94.5 52.5L0 127.5V75L94 0L175 63.8518V115L94.5 52.5Z"
							fill="currentColor"
							animatedProps={getStyles(t4, o4)}
						/>
					</Svg>
				</Animated.View>
			</Animated.View>
		</Portal>
	)
}
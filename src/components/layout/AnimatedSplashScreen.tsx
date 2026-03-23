import { useCallback, useImperativeHandle } from 'react'
import Animated, {
	cancelAnimation,
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
	atEnd: () => void
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
	let animatedEndtimeOut: NodeJS.Timeout | undefined
	const initialT = 150

	const opacity = useSharedValue(1)
	const scale = useSharedValue(0.9)
	const t1 = useSharedValue(initialT)
	const t2 = useSharedValue(initialT)
	const t3 = useSharedValue(initialT)
	const t4 = useSharedValue(initialT)

	const o1 = useSharedValue(0)
	const o2 = useSharedValue(0)
	const o3 = useSharedValue(0)
	const o4 = useSharedValue(0)

	const style1 = useAnimatedStyle(() => ({
		transform: [{ translateY: t1.value }],
		opacity: o1.value
	}))

	const style2 = useAnimatedStyle(() => ({
		transform: [{ translateY: t2.value }],
		opacity: o2.value
	}))

	const style3 = useAnimatedStyle(() => ({
		transform: [{ translateY: t3.value }],
		opacity: o3.value
	}))

	const style4 = useAnimatedStyle(() => ({
		transform: [{ translateY: t4.value }],
		opacity: o4.value
	}))

	const handleAnimationEnd = useCallback(() => {
		if (onAnimatedEnd) onAnimatedEnd()
	}, [onAnimatedEnd])

	const startAnimation = useCallback(() => {
		t1.value = withDelay(50, withSpring(0))
		o1.value = withDelay(50, withTiming(1, { duration: 800 }))

		t2.value = withDelay(200, withSpring(0))
		o2.value = withDelay(200, withTiming(1, { duration: 800 }))

		t3.value = withDelay(350, withSpring(0))
		o3.value = withDelay(350, withTiming(1, { duration: 800 }))

		t4.value = withDelay(500, withSpring(0))
		o4.value = withDelay(500, withTiming(1, { duration: 800 }))

		scale.value = withDelay(
			1000,
			withSpring(1, {}, (finished) => {
				if (finished) scheduleOnRN(handleAnimationEnd)
			})
		)
	}, [t1, t2, t3, t4, o1, o2, o3, o4, scale, handleAnimationEnd])

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
	}, [animatedEndtimeOut, t1, t2, t3, t4, o1, o2, o3, o4, scale])

	const resetAnimation = useCallback(() => {
		stopAnimation()

		t1.value = initialT
		t2.value = initialT
		t3.value = initialT
		t4.value = initialT

		o1.value = 0
		o2.value = 0
		o3.value = 0
		o4.value = 0

		scale.value = 0.9
	}, [t1, t2, t3, t4, o1, o2, o3, o4, scale, stopAnimation])

	const atEnd = useCallback(() => {
		t1.value = withDelay(50, withSpring(0))
		o1.value = withDelay(50, withTiming(1, { duration: 200 }))

		t2.value = withDelay(200, withSpring(0))
		o2.value = withDelay(200, withTiming(1, { duration: 200 }))

		t3.value = withDelay(350, withSpring(0))
		o3.value = withDelay(350, withTiming(1, { duration: 200 }))

		t4.value = withDelay(500, withSpring(0))
		o4.value = withDelay(500, withTiming(1, { duration: 200 }))

		scale.value = withSpring(1, {}, (finished) => {
			if (finished) scheduleOnRN(handleAnimationEnd)
		})
	}, [t1, t2, t3, t4, o1, o2, o3, o4, scale, handleAnimationEnd])

	const hide = useCallback(() => {
		opacity.value = withTiming(0, { duration: 300 })
	}, [opacity])

	useImperativeHandle(
		ref,
		() => ({
			startAnimation,
			stopAnimation,
			resetAnimation,
			hide,
			atEnd
		}),
		[startAnimation, stopAnimation, resetAnimation, hide, atEnd]
	)

	return (
		<Animated.View
			pointerEvents="none"
			className="absolute z-50 w-full h-full items-center justify-center"
			style={{
				opacity,
				backgroundColor: '#111827'
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
						animatedProps={style1}
					/>

					<AnimatedPath
						d="M175 166.5L103 110V161L174.5 217.127L175 166.5Z"
						fill="currentColor"
						animatedProps={style2}
					/>
					<AnimatedPath
						d="M69.5 308L0 253V203L102 282.5L69.5 308Z"
						fill="currentColor"
						animatedProps={style3}
					/>
					<AnimatedPath
						d="M94.5 52.5L0 127.5V75L94 0L175 63.8518V115L94.5 52.5Z"
						fill="currentColor"
						animatedProps={style4}
					/>
				</Svg>
			</Animated.View>
		</Animated.View>
	)
}
import { Stack } from 'expo-router'
import { StatusBar, type StatusBarStyle } from 'expo-status-bar'
import { View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import '../global.css'
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import * as Notifications from 'expo-notifications'
import * as SplashScreen from 'expo-splash-screen'
import * as SystemUI from 'expo-system-ui'
import { vars } from 'nativewind'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState
} from 'react'
import type { Modalize } from 'react-native-modalize'
import { Host } from 'react-native-portalize'
import {
	configureReanimatedLogger,
	ReanimatedLogLevel
} from 'react-native-reanimated'
import { colorKit } from 'reanimated-color-picker'
import AnimatedSplashScreen, {
	type AnimatedSplashScreenHandle
} from '@/components/layout/AnimatedSplashScreen'
import { DeleteModal } from '@/components/modal/DeleteModal'
import { FolderModal } from '@/components/modal/FolderModal'
import { Modal } from '@/components/modal/Modal'
import { TaskModal } from '@/components/modal/TaskModal'
import { UpdateAppModal } from '@/components/modal/updateApp'
import { useConfig } from '@/state/config'
import useFolder from '@/state/Folder'
import { useModal } from '@/state/modal'
import useTask from '@/state/Task'
import { useTheme } from '@/state/theme'
import type { Theme } from '@/types/theme'
import { migrateDB, removeNotificationId } from '@/utils/database'
import { useThemeStyles } from '@/utils/theme'

// This is the default configuration
configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false
})

SystemUI.setBackgroundColorAsync('transparent')
SplashScreen.hideAsync()

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
		priority: Notifications.AndroidNotificationPriority.HIGH
	}),
	handleSuccess: removeNotificationId
})

Notifications.setNotificationChannelAsync('default', {
	name: 'default',
	importance: Notifications.AndroidImportance.HIGH,
	vibrationPattern: [200, 100, 200],
	showBadge: true
})

Notifications.addNotificationResponseReceivedListener((response) => {
	;[response] // <- Only for the linter :)
	// Maybe it will be used in the future
	// const { data } = response.notification.request.content
})

export default function RootLayout() {
	const { theme, themes, load: loadThemes } = useTheme()
	const { load: loadConfigs } = useConfig()
	const { load: loadFolders } = useFolder()
	const { load: loadTasks } = useTask()
	const { setModal } = useModal()
	const taskModalRef = useRef<Modalize>(null)
	const folderModalRef = useRef<Modalize>(null)
	const deleteModalRef = useRef<Modalize>(null)
	const updateModalRef = useRef<Modalize>(null)
	const themeStyles = useThemeStyles()
	const splashScreenRef = useRef<AnimatedSplashScreenHandle>(null)
	let splashScreenAnimationTimeout: NodeJS.Timeout | undefined
	const [isReady, setIsReady] = useState(false)
	const hasAnimated = useRef(false)

	const themeVars = useMemo(() => {
		const entries = Object.entries(themes[theme as Theme].colors).map(
			([key, value]) => {
				return [`--${key}`, value]
			}
		)

		return Object.fromEntries(entries)
	}, [theme, themes])

	const statusBarProps = useMemo(() => {
		const backgroundColor = themeStyles.background()
		const style: StatusBarStyle = colorKit.isDark(backgroundColor)
			? 'light'
			: 'dark'

		return {
			backgroundColor,
			style
		}
	}, [themeStyles])

	const stackScreenOptions = useMemo<NativeStackNavigationOptions>(() => {
		return {
			headerShown: false,
			animation: 'slide_from_right',
			contentStyle: {
				backgroundColor: themeStyles.background()
			}
		}
	}, [themeStyles])

	useLayoutEffect(() => {
		async function init() {
			await migrateDB()

			await Promise.all([
				loadFolders(),
				loadTasks(),
				loadConfigs(),
				loadThemes()
			])
			setIsReady(true)
		}
		init()
	}, [loadFolders, loadTasks, loadConfigs, loadThemes])

	const getModalFns = useCallback((ref: React.RefObject<Modalize | null>) => {
		return {
			open: () => ref.current?.open(),
			close: () => ref.current?.close()
		}
	}, [])

	const handleAnimationEnd = useCallback(() => {
		hasAnimated.current = true

		if (!isReady) return

		setTimeout(() => {
			splashScreenRef.current?.atEnd()
			splashScreenRef.current?.hide()
			clearTimeout(splashScreenAnimationTimeout)
		}, 300)
	}, [isReady, splashScreenAnimationTimeout])

	useEffect(() => {
		if (!isReady || !hasAnimated.current) return

		splashScreenRef.current?.atEnd()
		splashScreenRef.current?.hide()

		clearTimeout(splashScreenAnimationTimeout)
	}, [isReady, splashScreenAnimationTimeout])

	useLayoutEffect(() => {
		setModal('task', { ...getModalFns(taskModalRef) })
		setModal('folder', { ...getModalFns(folderModalRef) })
		setModal('delete', { ...getModalFns(deleteModalRef) })
		setModal('update', { ...getModalFns(updateModalRef) })
	}, [setModal, getModalFns])

	useEffect(() => {
		setTimeout(() => {
			splashScreenRef.current?.startAnimation()
		}, 600)
	}, [])

	return (
		<GestureHandlerRootView>
			<Host>
				<AnimatedSplashScreen
					ref={splashScreenRef}
					onAnimatedEnd={handleAnimationEnd}
				/>
				<View
					style={[
						vars(themeVars),
						{
							backgroundColor: themeStyles.background()
						}
					]}
					className="flex-1"
				>
					<StatusBar
						style={statusBarProps.style}
						backgroundColor={statusBarProps.backgroundColor}
						translucent={false}
					/>
					<Stack screenOptions={stackScreenOptions} />
				</View>

				<Modal modalRef={taskModalRef}>
					<TaskModal />
				</Modal>

				<Modal modalRef={folderModalRef}>
					<FolderModal />
				</Modal>

				<Modal modalRef={deleteModalRef}>
					<DeleteModal />
				</Modal>

				<Modal modalRef={updateModalRef}>
					<UpdateAppModal />
				</Modal>
			</Host>
		</GestureHandlerRootView>
	)
}
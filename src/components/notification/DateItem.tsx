import { Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { useThemeStyles } from '@/utils/theme'

export function DateItem({
	value,
	className
}: {
	value: string | number
	className?: string
}) {
	const themeStyles = useThemeStyles()

	return (
		<View className={twMerge('', className)}>
			<Text className="" style={{ color: themeStyles.textPrimary() }}>
				{String(value).padStart(2, '0')}
			</Text>
		</View>
	)
}
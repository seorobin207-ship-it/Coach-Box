import { AntDesign } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'

type SettingItemProps = {
  label: string
  value?: string
  icon?: React.ReactNode
  onPress: () => void
}

export const SettingItem = ({ label, value, icon, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between py-4">
      <View className="flex-row items-center">
        {icon && <View className="mr-3">{icon}</View>}
        <Text className="text-base text-[#1E293B]">{label}</Text>
      </View>

      <View className="flex-row items-center">
        {value && <Text className="text-sm text-[#64748B] mr-2">{value}</Text>}
        <AntDesign name="right" size={16} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  )
}

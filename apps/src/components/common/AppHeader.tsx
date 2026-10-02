import { Image, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSettings } from '@/hooks/useSettings'
import { ERouteTable } from '@/constants/route-table'
import { useRouter } from 'expo-router'
import IconSetting from '~/assets/icon-svg/IconSetting'

type Props = {
  title?: string
}

const AppHeader = ({ title }: Props) => {
  const { userQuery } = useSettings()
  const router = useRouter()

  const avatarUrl =
    userQuery?.data?.avatar &&
    userQuery?.data?.avatar !== 'https://res.cloudinary.com/dk0w90uw9/image/upload/null'
      ? userQuery.data.avatar
      : 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg'

  return (
    <View className="flex-row items-center justify-between w-full">
      {/* Avatar */}
      <View className="bg-white/70 rounded-full p-[2px] shadow-sm">
        <Image source={{ uri: avatarUrl }} className="w-10 h-10 rounded-full" resizeMode="cover" />
      </View>

      {/* Title */}
      {title && (
        <Text className="text-[17px] font-semibold tracking-wide">{title}</Text>
      )}

      {/* Setting */}
      <TouchableOpacity
        onPress={() => router.push(ERouteTable.SETTING_SCREEN)}
        className="w-10 h-10 rounded-full bg-white/70 items-center justify-center shadow-sm"
        activeOpacity={0.8}
      >
        <IconSetting />
      </TouchableOpacity>
    </View>
  )
}

export default AppHeader

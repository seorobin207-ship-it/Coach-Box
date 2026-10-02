import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from 'react-native'
import { useEffect } from 'react'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'

import IconCamera from '~/assets/icon-svg/setting/IconCamera'
import IconPracticeSetting from '~/assets/icon-svg/setting/IconPracticeSetting'
import IconBook from '~/assets/icon-svg/setting/IconBook'
import IconInformation from '~/assets/icon-svg/setting/IconInformation'
import IconPassword from '~/assets/icon-svg/setting/IconPassword'
import IconSupport from '~/assets/icon-svg/setting/IconSupport'

import { ERouteTable } from '@/constants/route-table'
import { useSettings } from '@/hooks/useSettings'
import { useAuth } from '@/hooks/useAuth'
import { SettingItem } from '@/components/setting/SettingItem'

const SettingsScreen = () => {
  const { signOutMutation } = useAuth()
  const { userQuery, handleUpdateAvatar, userRankQuery } = useSettings()

  const isFocused = useIsFocused()
  const queryClient = useQueryClient()
  const isAndroid = Platform.OS === 'android'

  const avatarUrl =
    userQuery?.data?.avatar &&
    userQuery?.data?.avatar !== 'https://res.cloudinary.com/dk0w90uw9/image/upload/null'
      ? userQuery.data.avatar
      : 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png'

  const onSignOut = async () => {
    try {
      await signOutMutation.mutateAsync()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }, [isFocused])

  return (
    <SafeAreaView
      className="flex-1 bg-[#F8FAFC]"
      style={{ paddingTop: isAndroid ? StatusBar.currentHeight : 0 }}
    >
      {/* ===== Header ===== */}
      <View className="flex-row items-center justify-between px-4 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
        >
          <AntDesign name="left" size={20} color="#2E7D32" />
        </TouchableOpacity>

        <Text className="text-[18px] font-semibold text-[#1B5E20]">Cài đặt</Text>

        <View className="w-10 h-10" />
      </View>

      {/* ===== Profile Card ===== */}
      <View className="mx-4 bg-white rounded-3xl p-5 items-center shadow-md">
        <View className="relative">
          <Image source={{ uri: avatarUrl }} className="w-24 h-24 rounded-full" />
          <TouchableOpacity
            onPress={handleUpdateAvatar}
            className="absolute -right-1 -bottom-1 bg-emerald-500 w-8 h-8 rounded-full items-center justify-center"
          >
            <IconCamera />
          </TouchableOpacity>
        </View>

        <Text className="mt-4 text-lg font-semibold text-[#1E293B]">
          {userQuery.data?.fullName}
        </Text>
      </View>

      {/* ===== Stats ===== */}
      <View className="flex-row mx-4 mt-6 gap-2 space-x-4">
        <View className="flex-1 bg-primary-lighter rounded-2xl p-4">
          <View className="flex-row items-center mb-2">
            <IconPracticeSetting />
            <Text className="ml-2 font-semibold text-[#1E293B]">Thực hành</Text>
          </View>
          <Text className="text-sm text-[#64748B]">Xếp hạng</Text>
          <Text className="text-xl font-bold text-emerald-600">
            #{userRankQuery.data?.practice?.rank || 0}
          </Text>
        </View>

        <View className="flex-1 bg-[#E6F7F2] rounded-2xl p-4">
          <View className="flex-row items-center mb-2">
            <IconBook />
            <Text className="ml-2 font-semibold text-[#1E293B]">Học tập</Text>
          </View>
          <Text className="text-sm text-[#64748B]">Điểm</Text>
          <Text className="text-xl font-bold text-emerald-600">
            {userRankQuery.data?.learning?.score || 0}
          </Text>
        </View>
      </View>

      {/* ===== Settings List ===== */}
      <View className="mx-4 mt-8 bg-white rounded-3xl px-5 shadow-sm">
        <SettingItem
          label="Tên người dùng"
          value={userQuery.data?.fullName}
          onPress={() => router.push(ERouteTable.EDIT_NAME)}
        />

        <SettingItem
          icon={<IconInformation />}
          label="Giới thiệu"
          onPress={() => router.push(ERouteTable.ABOUT_US)}
        />

        <SettingItem
          icon={<IconPassword />}
          label="Đổi mật khẩu"
          onPress={() => router.push(ERouteTable.RESET_PASSWORD)}
        />

        <SettingItem
          icon={<IconSupport />}
          label="Hỗ trợ"
          onPress={() => router.push(ERouteTable.SUPPORT)}
        />
      </View>

      {/* ===== Logout ===== */}
      <TouchableOpacity
        onPress={onSignOut}
        className="mx-4 mt-10 bg-red-50 py-4 rounded-2xl items-center"
      >
        <Text className="text-red-600 font-semibold">Đăng xuất</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default SettingsScreen

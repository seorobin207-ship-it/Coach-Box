import React from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { images } from '@/constants'
import AppHeader from '@/components/common/AppHeader'
import { CloudAdd } from 'iconsax-react-native'

export default function PlaySituationScreen() {
  return (
    <ImageBackground source={images.bgChatBot} resizeMode="cover" className="flex-1">
      <View className="flex-1">
        {/* Header */}
        <View className="mt-16 mx-4">
          <AppHeader title="Chatbot AI" />
        </View>

        {/* Body content */}
        <View className="flex-1 px-6 justify-between pb-10">
          <View />

          {/* CTA buttons */}
          <View>
            <View className="mt-8 mb-4 items-center">
              <Text className="text-center text-4xl font-bold text-gray-900 mb-3">
                Huấn luyện viên Boxing{'\n'}của riêng bạn
              </Text>

              <Text className="text-center text-secondary px-4">
                Chatbot AI thông minh giúp bạn luyện kỹ thuật, xây dựng giáo án và nâng cấp thể lực
                boxing mỗi ngày.
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              <TouchableOpacity
                onPress={() => router.push('/play-situation-chat')}
                className="flex-1 bg-primary-main border border-primary-dark rounded-full py-3.5 items-center justify-center shadow-lg"
                activeOpacity={0.9}
              >
                <Text className="text-white font-bold text-base">Bắt đầu tập luyện!</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/play-situation-history')}
                className="ml-3 h-12 w-12 rounded-full bg-secondary-main items-center justify-center shadow-md border border-secondary-dark"
                activeOpacity={0.9}
              >
                <CloudAdd size="20" color="#fff" variant="Bold" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  )
}

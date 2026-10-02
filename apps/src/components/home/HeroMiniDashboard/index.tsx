import { images } from '@/constants'
import { ImageBackground } from 'expo-image'
import { Text, View } from 'react-native'

export function HeroMiniDashboard({ userName, progress }: any) {
  return (
    <ImageBackground
      source={images.BannerHome}
      className="mx-4 mt-3 rounded-2xl overflow-hidden h-[120px]"
    >
      <View className="flex-1 bg-black/10 p-4 justify-between">
        <Text className="text-white font-semibold">Chào {userName} 👋</Text>
        <Text className="text-white/90 text-sm">
          Hôm nay con đã hoàn thành {progress.completed}/{progress.total} bài
        </Text>
      </View>
    </ImageBackground>
  )
}

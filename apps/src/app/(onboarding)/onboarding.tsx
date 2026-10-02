import { FlatList, ImageBackground, Text, View, Dimensions, Pressable } from 'react-native'
import { useRef, useState } from 'react'
import { ONBOARDING_DATA } from '@/constants/onboarding'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import AppButton from '@/components/common/AppButton'

const { width } = Dimensions.get('window')

export default function Onboarding() {
  const flatListRef = useRef<FlatList>(null)
  const [index, setIndex] = useState(0)

  const isLast = index === ONBOARDING_DATA.length - 1

  const handleNext = () => {
    if (isLast) {
      router.replace(ERouteTable.SIGIN_IN)
    } else {
      flatListRef.current?.scrollToIndex({ index: index + 1 })
    }
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width)
          setIndex(i)
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1">
            {/* Hero Image */}
            <ImageBackground source={item.image} resizeMode="cover" className="flex-1">
              {/* Bottom Content Card */}
              <View className="px-6 py-8 mt-20">
                <Text className="text-4xl font-semibold text-white">
                  {item.title}
                </Text>

                <Text className="mt-3 text-base text-white leading-relaxed">
                  {item.description}
                </Text>
              </View>

              <View className="absolute bottom-0 w-full px-6 pb-10">
                <View className="px-6 py-8">
                  {/* Indicator */}
                  <View className="flex-row justify-center gap-2 mt-6">
                    {ONBOARDING_DATA.map((_, i) => (
                      <View
                        key={i}
                        className={`h-2 rounded-full transition-all ${
                          i === index ? 'w-2 bg-white' : 'w-2 bg-white opacity-[30%]'
                        }`}
                      />
                    ))}
                  </View>

                  {/* Button */}
                  <View className="mt-6 items-center">
                    <AppButton
                      title={isLast ? 'Bắt đầu' : 'Tiếp theo'}
                      className="!w-[180px] border border-primary-dark"
                      onPress={handleNext}
                    />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
        )}
      />
    </View>
  )
}

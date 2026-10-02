import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  ImageBackground,
  Image,
  ImageSourcePropType,
} from 'react-native'
import { router } from 'expo-router'
import { useEffect, useState, useMemo } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useHome } from '@/hooks/useHome'

import Svg, { Circle } from 'react-native-svg'

import HeaderHome from '@/components/home/HeaderHome'
import ItemLessonHome, { IDataItemLessonHomeProps } from '@/components/ItemLessonHome'
import AppBackground from '@/components/common/AppBackground'

/* ================== PLACEHOLDER ================== */
function toEvenArrayWithPlaceholder(
  data: IDataItemLessonHomeProps[] = [],
): IDataItemLessonHomeProps[] {
  const cloned = [...data]

  if (cloned.length % 2 !== 0) {
    cloned.push({
      id: -1,
      title: '',
      description: '',
      thumb: '',
      rank: '',
      image: '',
      isCompleted: false,
      isLocked: true,
      category: { id: 0, title: '' },
      score: { score: 0, totalScore: 0 },
      isPlaceholder: true,
    })
  }

  return cloned
}

/* Ảnh fix cứng cho từng danh mục (BE chưa hỗ trợ ảnh), map theo thứ tự category */
const CATEGORY_CARD_IMAGES: ImageSourcePropType[] = [
  images.category1,
  images.category2,
  images.category3,
  images.category4,
  images.category5,
  images.category6,
  images.bgPractice,
  images.BannerHome,
]

function getCategoryImage(index: number): ImageSourcePropType {
  return CATEGORY_CARD_IMAGES[index % CATEGORY_CARD_IMAGES.length] ?? images.defaultImage
}

/* ================== SCREEN ================== */
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<number | null>(null)
  const { categoriesQuery, learningItemsQuery } = useHome(activeTab ?? 0)
  const isFocused = useIsFocused()

  console.log(learningItemsQuery,'categoriesQuerycategoriesQuery');
  

  /* -------- Init active category -------- */
  useEffect(() => {
    if (isFocused && categoriesQuery.data?.length) {
      setActiveTab(categoriesQuery.data[0].id)
    }
  }, [isFocused, categoriesQuery.data])

  const currentCategory = categoriesQuery.data?.find((c) => c.id === activeTab)

  /* -------- Next lesson (CTA) -------- */
  const nextLesson = useMemo(() => {
    return learningItemsQuery.data?.find((item) => !item.isCompleted && !item.isLocked)
  }, [learningItemsQuery.data])

  return (
    <AppBackground>
      <View className="flex-1">
        {/* 1️⃣ HEADER / HERO */}
        <HeaderHome />

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-4">
          <View>
            <Text className="text-3xl font-bold text-primary">Sẵn sàng lên đài chưa,</Text>
            <Text className="text-3xl font-bold text-primary-main">Nhà vô địch?</Text>
          </View>

          {/* 4️⃣ DANH MỤC - 6 categories, 2 hàng × 3 item */}
          <View className="mt-3">
            <Text className="text-xl font-bold text-primary mb-3">Danh mục</Text>
            {(() => {
              const list = (categoriesQuery.data ?? []).slice(0, 6)
              const row1 = list.slice(0, 3)
              const row2 = list.slice(3, 6)
              const renderCard = (cat: (typeof list)[0], index: number, isLastInRow: boolean) => {
                const isActive = cat.id === activeTab
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setActiveTab(cat.id)}
                    activeOpacity={0.9}
                    className="flex-1 rounded-3xl overflow-hidden"
                    style={{ height: 88, marginRight: isLastInRow ? 0 : 8 }}
                  >
                    <ImageBackground
                      source={getCategoryImage(index)}
                      resizeMode="cover"
                      className="h-full w-full justify-center items-center"
                    >
                      <View
                        className="absolute inset-0"
                        style={{
                          backgroundColor: isActive
                            ? 'rgba(255, 99, 21, 0.8)'
                            : 'rgba(0, 0, 0, 0.35)',
                        }}
                      />
                      <Text
                        className="font-bold text-sm text-white text-center px-2"
                        numberOfLines={2}
                      >
                        {cat.title}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )
              }
              return (
                <View>
                  <View className="flex-row mb-2">{row1.map((cat, i) => renderCard(cat, i, i === row1.length - 1))}</View>
                  <View className="flex-row">{row2.map((cat, i) => renderCard(cat, i + 3, i === row2.length - 1))}</View>
                </View>
              )
            })()}
          </View>

          {/* 2️⃣ PROGRESS CARD - thiết kế hình tròn */}
          {currentCategory && (
            <View className="mt-4 bg-primary-lighter rounded-2xl overflow-hidden p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View
                    className="self-start rounded-full px-3 py-1 mb-2"
                    style={{ backgroundColor: 'rgba(255, 99, 21, 0.2)' }}
                  >
                    <Text className="text-xs font-semibold text-primary-dark">Tiến độ</Text>
                  </View>
                  <Text className="text-xs text-secondary mb-0.5">Danh mục</Text>
                  <Text className="text-lg font-bold text-primary">{currentCategory.title}</Text>
                </View>
                <View className="items-center justify-center" style={{ width: 88, height: 88 }}>
                  <Svg width={88} height={88} style={{ position: 'absolute' }}>
                    <Circle
                      cx={44}
                      cy={44}
                      r={38}
                      stroke="#FFE3D1"
                      strokeWidth={8}
                      fill="transparent"
                    />
                    <Circle
                      cx={44}
                      cy={44}
                      r={38}
                      stroke="#FF6315"
                      strokeWidth={8}
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={
                        2 * Math.PI * 38 * (1 - currentCategory.completedCourses / (currentCategory.totalCourses || 1))
                      }
                      strokeLinecap="round"
                      transform="rotate(-90 44 44)"
                    />
                  </Svg>
                  <Text className="text-lg font-bold text-primary">
                    {currentCategory.completedCourses}/{currentCategory.totalCourses}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {/* 3️⃣ CONTINUE LEARNING */}
          {nextLesson && (
            <View className="mt-4 p-4 flex-row justify-between items-center rounded-2xl bg-secondary-lighter">
              <View>
                <Text className="text-secondary-main font-semibold text-sm opacity-90">Đang học</Text>
                <Text className="text-primary text-lg mt-1">{nextLesson.title}</Text>
              </View>
              <TouchableOpacity onPress={() =>
                router.push({
                  pathname: ERouteTable.DETAIL_LESSON,
                  params: {
                    coursesId: nextLesson.id,
                    score: nextLesson.score?.score ?? 0,
                    totalScore: nextLesson.score?.totalScore ?? 100,
                  },
                })
              } className="bg-secondary-main px-4 py-2 rounded-full">
                <Text className="text-white font-semibold text-sm">Tiếp tục</Text>
              </TouchableOpacity>

            </View>
          )}

          {/* 5️⃣ LESSON GRID */}
          <View className="mt-6 mb-2">
            <Text className="text-xl font-extrabold text-gray-900">Bài học</Text>
          </View>

          {learningItemsQuery.isLoading ? (
            <ActivityIndicator className="mt-10" color="#22c55e" />
          ) : (
            <FlatList
              data={toEvenArrayWithPlaceholder(learningItemsQuery.data || [])}
              keyExtractor={(item, index) =>
                item.id !== -1 ? String(item.id) : `placeholder-${index}`
              }
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ paddingBottom: 32 }}
              renderItem={({ item }) =>
                item.isPlaceholder ? (
                  <View className="flex-1 h-[180px]" />
                ) : (
                  <ItemLessonHome
                    data={item}
                    onPress={() =>
                      router.push({
                        pathname: ERouteTable.DETAIL_LESSON,
                        params: {
                          coursesId: item.id,
                          score: item.score?.score ?? 0,
                          totalScore: item.score?.totalScore ?? 100,
                        },
                      })
                    }
                  />
                )
              }
            />
          )}
        </ScrollView>
      </View>
    </AppBackground>
  )
}

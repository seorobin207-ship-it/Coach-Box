// app/blog-detail.tsx
import React, { useMemo, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Share,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

// Import data blog dạng travelogue
import { blogPosts, Post } from '@/data/blog'

export default function BlogDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const post: Post | undefined = useMemo(() => blogPosts.find((p) => p.id === (id ?? '')), [id])

  const onShare = useCallback(async () => {
    if (!post) return
    try {
      await Share.share({
        title: post.title,
        message: `${post.title}\n\n${post.excerpt}`,
      })
    } catch {}
  }, [post])

  if (!post) {
    return (
      <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: StatusBar.currentHeight }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <Ionicons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text className="text-base font-semibold">Nhật ký hoạt động xanh</Text>
          <View style={{ width: 32 }} />
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-gray-500">Bài viết không tồn tại hoặc đã được gỡ.</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: StatusBar.currentHeight }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text className="text-base font-semibold">Nhật ký hoạt động xanh</Text>
        <TouchableOpacity onPress={onShare} className="p-2">
          <Ionicons name="share-social-outline" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Cover */}
        <Image source={post.coverStatic} className="w-full h-56" resizeMode="cover" />

        {/* Title + tags */}
        <View className="px-5 mt-4">
          <Text className="text-2xl font-bold text-gray-900 mb-2">{post.title}</Text>

          <View className="flex-row flex-wrap">
            {post.tags.map((t, idx) => (
              <View key={`${t}-${idx}`} className="px-2 py-1 mr-2 mb-2 rounded-full bg-emerald-100">
                <Text className="text-emerald-700 text-xs font-medium">{t}</Text>
              </View>
            ))}
          </View>

          {/* Meta */}
          <Text className="text-gray-500 text-xs mt-1">
            ✍️ {post.author ?? 'GreenKids'}
            {post.publishedAt ? ` • ${post.publishedAt}` : ''}
            {post.readMins ? ` • ${post.readMins} phút đọc` : ''}
          </Text>
        </View>

        {/* Content sections */}
        <View className="px-5 mt-6">
          {post.sections?.map((sec, idx) => (
            <View key={idx} className="mb-6">
              <Text className="text-lg font-semibold text-emerald-800 mb-2">{sec.heading}</Text>
              {!!sec.content && <Text className="text-gray-700 leading-6">{sec.content}</Text>}

              {/* Cho phép dữ liệu cũ có bullets (nếu bạn vẫn muốn giữ) */}
              {'bullets' in sec && Array.isArray((sec as any).bullets) ? (
                <View className="mt-2">
                  {(sec as any).bullets.map((b: string, bi: number) => (
                    <View key={bi} className="flex-row items-start mb-1">
                      <Text className="text-emerald-600 mr-2">{'•'}</Text>
                      <Text className="text-gray-700 flex-1 leading-6">{b}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              {/* Nếu có ảnh minh họa cho từng section */}
              {'photos' in sec && Array.isArray((sec as any).photos) ? (
                <View className="mt-3">
                  {(sec as any).photos.map((ph: any, pi: number) => (
                    <Image key={pi} source={ph} className="w-full h-44 mb-3 rounded-xl" />
                  ))}
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

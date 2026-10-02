import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, TouchableOpacity, View, FlatList } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { useIsFocused } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { images } from '@/constants'
import { ChatOptionsModal, DeleteChatModal, RenameChatModal } from '@/components/chat/ChatModals'
import API_CLIENT from '@/libs/api/client'

type ChatItem = {
  id: string // numeric id dùng cho các endpoint /chat/conversations/{id}
  title: string
  conversationId: string // conversationId (uuid) dùng cho POST /chat
}

export default function PlaySituationHistoryScreen() {
  const [chats, setChats] = useState<ChatItem[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null)
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [renameVisible, setRenameVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [tempTitle, setTempTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isFocused = useIsFocused()

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      const res = await API_CLIENT.get('/chat/conversations')
      const items: any[] = res.data ?? []
      const mapped: ChatItem[] = items.map((it) => ({
        id: String(it.id),
        title: it.title || it.name || 'Cuộc trò chuyện',
        conversationId: String(it.conversationId ?? it.id),
      }))
      setChats(mapped)
    } catch (e) {
      console.error('Fetch conversations error', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (isFocused) fetchConversations()
  }, [isFocused])

  const openOptions = (chat: ChatItem) => {
    setSelectedChat(chat)
    setTempTitle(chat.title)
    setOptionsVisible(true)
  }

  const handleConfirmRename = async () => {
    if (!selectedChat) return
    try {
      await API_CLIENT.patch(`/chat/conversations/${selectedChat.id}/rename`, {
        title: tempTitle,
      })
      setChats((prev) =>
        prev.map((c) => (c.id === selectedChat.id ? { ...c, title: tempTitle } : c)),
      )
    } catch (e) {
      console.error('Rename conversation error', e)
    } finally {
      setRenameVisible(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedChat) return
    try {
      await API_CLIENT.delete(`/chat/conversations/${selectedChat.id}`)
      setChats((prev) => prev.filter((c) => c.id !== selectedChat.id))
    } catch (e) {
      console.error('Delete conversation error', e)
    } finally {
      setDeleteVisible(false)
    }
  }

  return (
    <ImageBackground source={images.bgChatHistory} resizeMode="cover" className="flex-1">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-9 w-9 rounded-full bg-white/90 items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="chevron-back" size={20} color="#111827" />
          </TouchableOpacity>

          <Text className="text-sm font-semibold text-gray-900">Lịch sử chat</Text>

          <View className="h-9 w-9" />
        </View>

        {/* List */}
        <View className="flex-1 px-4 pb-6">
          <View className="flex-1">
            <FlatList
              data={chats}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <View className="h-3" />}
              refreshing={isLoading}
              onRefresh={fetchConversations}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    router.push({
                      pathname: '/play-situation-chat',
                      params: {
                        conversationId: item.conversationId,
                        conversationNumericId: item.id,
                        title: item.title,
                      },
                    })
                  }
                  className="flex-row items-center justify-between bg-white rounded-full px-5 py-3 shadow-xs"
                >
                  <Text className="text-sm text-gray-900">{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => openOptions(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="ellipsis-horizontal" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>

        <ChatOptionsModal
          visible={optionsVisible}
          onClose={() => setOptionsVisible(false)}
          onPressRename={() => {
            setOptionsVisible(false)
            setRenameVisible(true)
          }}
          onPressDelete={() => {
            setOptionsVisible(false)
            setDeleteVisible(true)
          }}
        />

        <RenameChatModal
          visible={renameVisible}
          onClose={() => setRenameVisible(false)}
          value={tempTitle}
          onChangeText={setTempTitle}
          onConfirm={handleConfirmRename}
        />

        <DeleteChatModal
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          message="Bạn có chắc chắn muốn xóa đoạn chat này?"
          onConfirm={handleConfirmDelete}
        />
      </SafeAreaView>
    </ImageBackground>
  )
}


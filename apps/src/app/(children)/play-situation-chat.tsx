import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Send2 } from 'iconsax-react-native'
import { ChatOptionsModal, DeleteChatModal, RenameChatModal } from '@/components/chat/ChatModals'
import API_CLIENT from '@/libs/api/client'
import { images } from '@/constants'
import { useAuthStore } from '@/store/useAuthStore'
import logoChat from '~/assets/images/logo-chat.png'

type Message = {
  id: string
  from: 'bot' | 'me'
  text: string
}

const initialMessages: Message[] = []

export default function PlaySituationChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const [chatTitle, setChatTitle] = useState('Cuộc trò chuyện')
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [renameVisible, setRenameVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null) // uuid
  const [conversationNumericId, setConversationNumericId] = useState<string | null>(null) // numeric id cho /chat/conversations/{id}
  const [isSending, setIsSending] = useState(false)
  const params = useLocalSearchParams<{
    conversationId?: string
    conversationNumericId?: string
    title?: string
  }>()
  const { user } = useAuthStore()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Chào buổi sáng'
    if (hour < 18) return 'Chào buổi chiều'
    return 'Chào buổi tối'
  }

  const displayName = user?.fullName || user?.name || user?.username || user?.email || 'bạn'
  const greetingText = `${getGreeting()} nha ${displayName}`

  useEffect(() => {
    if (params.title) {
      setChatTitle(params.title)
    }
    if (params.conversationId) {
      setConversationId(String(params.conversationId))
    }

    const detailId = params.conversationNumericId || params.conversationId
    if (detailId) {
      const id = String(detailId)
      setConversationNumericId(id)
      ;(async () => {
        try {
          const res = await API_CLIENT.get(`/chat/conversations/${id}`)
          const data = res.data ?? {}
          if (data.title && !params.title) {
            setChatTitle(data.title)
          }
          if (data.conversationId && !conversationId) {
            setConversationId(String(data.conversationId))
          }
          if (data.id && !params.conversationNumericId) {
            setConversationNumericId(String(data.id))
          }
          const rawMessages: any[] = data.messages ?? data.history ?? []
          const mapped: Message[] = rawMessages.map((m, index) => {
            const fromValue = m.from || m.role || m.sender || 'bot'
            const normalizedFrom: 'bot' | 'me' =
              fromValue === 'user' || fromValue === 'me' ? 'me' : 'bot'
            const textValue = m.text ?? m.message ?? m.content ?? ''
            return {
              id: String(m.id ?? index),
              from: normalizedFrom,
              text: textValue,
            }
          })
          setMessages(mapped)
        } catch (error) {
          console.error('Fetch conversation detail error', error)
        }
      })()
    }
  }, [params.conversationId, params.title])

  const handleSend = async () => {
    const content = input.trim() || selectedSuggestion
    if (!content) return
    if (isSending) return

    const userMessage: Message = {
      id: `${Date.now()}-me`,
      from: 'me',
      text: content,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSelectedSuggestion(null)
    setIsSending(true)

    try {
      const formData = new FormData()
      formData.append('message', content)
      if (conversationId) {
        formData.append('conversationId', conversationId)
      }

      const response = await API_CLIENT.post('/chat', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const data = response.data ?? {}
      const newConversationId: string | undefined = data.conversationId
      if (newConversationId && newConversationId !== conversationId) {
        setConversationId(newConversationId)
      }

      const botText: string = data.reply ?? data.botMessage ?? data.message ?? data.answer ?? ''

      if (botText) {
        const botMessage: Message = {
          id: `${Date.now()}-bot`,
          from: 'bot',
          text: botText,
        }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Send chat error', error)
    } finally {
      setIsSending(false)
    }
  }

  const suggestions = [
    'Tôi mới bắt đầu, nên tập gì trước?',
    'Hướng dẫn tư thế boxing cơ bản',
    'Cách đấm jab đúng kỹ thuật',
    'Sửa lỗi khi đấm cross',
    'Bài tập footwork cho người mới',
    'Lịch tập boxing 30 phút hôm nay',
    'Combo 1-2 luyện như thế nào?',
    'Cách thở khi đấm và di chuyển',
  ]

  const renderMarkdownText = (text: string) => {
    const lines = text.split('\n')

    const renderInline = (content: string, keyPrefix: string) => {
      const parts: React.ReactNode[] = []
      const regex = /\*\*(.+?)\*\*/g
      let lastIndex = 0
      let match: RegExpExecArray | null

      while ((match = regex.exec(content)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <Text key={`${keyPrefix}-plain-${lastIndex}`}>
              {content.slice(lastIndex, match.index)}
            </Text>,
          )
        }
        parts.push(
          <Text key={`${keyPrefix}-bold-${match.index}`} className="font-semibold">
            {match[1]}
          </Text>,
        )
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < content.length) {
        parts.push(<Text key={`${keyPrefix}-tail`}>{content.slice(lastIndex)}</Text>)
      }

      return parts
    }

    return (
      <View>
        {lines.map((line, index) => {
          if (!line.trim()) {
            return <View key={`empty-${index}`} className="h-1" />
          }

          const bulletMatch = line.match(/^\s*[\*\-]\s+(.*)$/)
          if (bulletMatch) {
            const content = bulletMatch[1]
            return (
              <View key={`bullet-${index}`} className="flex-row">
                <Text className="text-sm text-gray-800 mr-1">{'\u2022'}</Text>
                <Text className="text-sm text-gray-800 flex-1">
                  {renderInline(content, `bullet-${index}`)}
                </Text>
              </View>
            )
          }

          return (
            <Text key={`line-${index}`} className="text-sm text-gray-800">
              {renderInline(line, `line-${index}`)}
            </Text>
          )
        })}
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#F5F6FA]">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => router.back()}
              className="h-12 w-12 rounded-full bg-white items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={24} color="#111827" />
            </TouchableOpacity>

            <View className="flex-1 items-center px-2">
              <Text
                className="text-lg font-semibold text-gray-900"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {conversationId || conversationNumericId ? chatTitle : 'Trò chuyện mới'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setOptionsVisible(true)}
              className="h-12 w-12 rounded-full bg-white items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat container */}
        <View className="flex-1 px-4 pb-4">
          <View className="flex-1 bg-[#F5F6FA] rounded-3xl px-3 pt-2 pb-3">
            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
            >
              {messages.length === 0 && (
                <View className="items-center mt-10 mb-6">
                  <View className="h-32 w-32 rounded-full overflow-hidden mb-4">
                    <Image source={images.logoChat} className="h-full w-full" resizeMode="cover" />
                  </View>
                  <Text className="text-base font-semibold text-center mb-2">{greetingText}</Text>
                  <Text className="text-base italic text-center mb-2">
                    Bạn đang cần hỗ trợ về vấn đề gì ?
                  </Text>
                </View>
              )}

              {messages.map((m) => {
                const isMe = m.from === 'me'
                return (
                  <View
                    key={m.id}
                    className={`mb-3 flex-row ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <View className="h-7 w-7 rounded-full bg-emerald-100 items-center justify-center mr-2">
                        <Ionicons name="person" size={14} color="#047857" />
                      </View>
                    )}
                    <View className="max-w-[78%]">
                      {!isMe && (
                        <Text className="mb-0.5 text-[11px] font-semibold">Chatbot AI</Text>
                      )}
                      {isMe && (
                        <View className="flex-row justify-end mb-1 gap-2 items-center">
                          <Text className="mb-0.5 text-[11px] font-semibold text-right">Me</Text>
                          <View className="h-7 w-7 rounded-full bg-primary-main items-center justify-center mr-2">
                            <Ionicons name="person" size={14} color="#fff" />
                          </View>
                        </View>
                      )}
                      <View
                        className={`rounded-3xl px-4 py-2 ${
                          isMe ? 'bg-primary-light rounded-br-sm' : 'bg-white rounded-bl-sm'
                        }`}
                      >
                        {isMe ? (
                          <Text className="text-sm">{m.text}</Text>
                        ) : (
                          renderMarkdownText(m.text)
                        )}
                      </View>
                    </View>
                  </View>
                )
              })}

              {isSending && (
                <View className="mb-3 flex-row justify-start">
                  <View className="h-7 w-7 rounded-full bg-emerald-100 items-center justify-center mr-2">
                    <Ionicons name="person" size={14} color="#047857" />
                  </View>
                  <View className="max-w-[78%]">
                    <Text className="mb-0.5 text-[11px] text-gray-500">Chatbot AI</Text>
                    <View className="rounded-3xl px-4 py-2 bg-white rounded-bl-sm">
                      <Text className="text-sm text-gray-500">Đang trả lời...</Text>
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Suggestions */}
            <View className={`mb-3 ${messages.length === 0 ? 'mt-0' : 'mt-1'}`}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {suggestions.map((sug) => {
                  const active = selectedSuggestion === sug
                  return (
                    <TouchableOpacity
                      key={sug}
                      onPress={() => {
                        if (active) {
                          setSelectedSuggestion(null)
                          setInput('')
                        } else {
                          setSelectedSuggestion(sug)
                          setInput(sug)
                        }
                      }}
                      className={`mr-2 px-4 py-2 rounded-full ${
                        active ? 'bg-gray-300' : 'bg-gray-200'
                      }`}
                      activeOpacity={0.8}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          active ? 'text-gray-800' : 'text-gray-700'
                        }`}
                      >
                        {sug}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </View>

            {/* Input */}
            <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <TextInput
                placeholder="Câu trả lời..."
                placeholderTextColor="#9CA3AF"
                value={input}
                onChangeText={setInput}
                className="flex-1 text-sm text-gray-900 mr-3"
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={isSending || (!input.trim() && !selectedSuggestion)}
                className={`h-12 w-12 rounded-full border items-center justify-center ${
                  isSending || (!input.trim() && !selectedSuggestion)
                    ? 'bg-primary-lighter border-primary-lighter'
                    : 'bg-primary-main border-primary-dark'
                }`}
                activeOpacity={0.8}
              >
                <Send2 size="20" color="#fff" />
              </TouchableOpacity>
            </View>
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
          value={chatTitle}
          onChangeText={setChatTitle}
          onConfirm={async () => {
            const id = conversationNumericId
            if (!id) {
              setRenameVisible(false)
              return
            }
            try {
              await API_CLIENT.patch(`/chat/conversations/${id}/rename`, {
                title: chatTitle,
              })
            } catch (error) {
              console.error('Rename conversation error', error)
            } finally {
              setRenameVisible(false)
            }
          }}
        />

        <DeleteChatModal
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}
          message="Bạn có chắc chắn muốn xóa đoạn chat này?"
          onConfirm={async () => {
            try {
              if (conversationNumericId) {
                await API_CLIENT.delete(`/chat/conversations/${conversationNumericId}`)
              }
              setMessages(initialMessages)
              setDeleteVisible(false)
              router.back()
            } catch (error) {
              console.error('Delete conversation error', error)
              setDeleteVisible(false)
            }
          }}
        />
      </SafeAreaView>
    </View>
  )
}

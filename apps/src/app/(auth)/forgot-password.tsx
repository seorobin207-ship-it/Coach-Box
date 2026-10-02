import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Pressable,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Ionicons } from '@expo/vector-icons'

/* ---------------- Schema ---------------- */
const schema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
})

type FormData = {
  email: string
}

export default function ForgotPassword() {
  const router = useRouter()
  const { forgotPasswordMutation } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      await forgotPasswordMutation.mutateAsync(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={images.bgAuth}
      resizeMode="cover"
      className="flex-1 justify-center px-6"
    >
      {/* Gradient overlay */}
      <View className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-white/40 to-white/80" />

      {/* Card */}
      <View className="rounded-[28px] bg-white/85 px-6 py-8 shadow-2xl">
        {/* Logo */}
        <View className="items-center mb-6">
          <Image source={images.logoApp} className="w-[150px] h-[42px]" resizeMode="contain" />
        </View>

        {/* Heading */}
        <Text className="text-2xl font-extrabold text-center text-green-900">Quên mật khẩu?</Text>
        <Text className="text-center text-green-800/70 mt-2 mb-8 leading-relaxed">
          Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu
        </Text>

        {/* Email input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <View className="flex-row items-center rounded-2xl bg-[#F8FAFC] px-4 py-3">
                <Ionicons name="mail-outline" size={20} color="#22C55E" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-[#0F172A]"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              {errors.email && (
                <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
              )}
            </View>
          )}
        />

        {/* CTA */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`h-12 rounded-2xl items-center justify-center bg-green-600 ${
            loading ? 'opacity-60' : ''
          }`}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? 'Đang gửi...' : 'Gửi email khôi phục'}
          </Text>
        </Pressable>

        {/* Back to login */}
        <TouchableOpacity
          className="flex-row justify-center items-center gap-2 mt-6"
          onPress={() => router.push(ERouteTable.SIGIN_IN)}
        >
          <Ionicons name="arrow-back-outline" size={16} color="#15803D" />
          <Text className="text-sm font-medium text-green-700">Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

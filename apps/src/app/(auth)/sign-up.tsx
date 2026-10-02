import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { images } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

/* ---------------- Schema ---------------- */
const schema = yup.object({
  fullName: yup.string().min(2, 'Tối thiểu 2 ký tự').required('Vui lòng nhập tên người dùng'),
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup.string().min(6, 'Tối thiểu 6 ký tự').required('Vui lòng nhập mật khẩu'),
})

type FormData = {
  fullName: string
  email: string
  password: string
}

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signUpMutation } = useAuth()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      await signUpMutation.mutateAsync(data)
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
      <View className="items-center mb-6 absolute top-[10%] mx-auto left-0 right-0">
        <Image source={images.logoApp} className="w-[200px] h-[80px]" resizeMode="contain" />
      </View>
      {/* Card */}
      <View className="rounded-[28px] bg-white px-6 py-8 shadow-2xl">
        {/* Heading */}
        <Text className="text-3xl text-center">
          Đăng ký
        </Text>
        <Text className="text-center text-secondary mt-2 mb-8 leading-relaxed">
          Đăng ký tài khoản mới
        </Text>

        {/* Full name */}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <View className="flex-row items-center rounded-full bg-white border border-[#919EAB52] px-4 py-3">
                <TextInput
                  placeholder="Tên người dùng"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-[#0F172A]"
                  value={value}
                  onChangeText={onChange}
                />
              </View>
              {errors.fullName && (
                <Text className="text-red-500 text-xs mt-1">{errors.fullName.message}</Text>
              )}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <View className="flex-row items-center rounded-full bg-white border border-[#919EAB52] px-4 py-3">
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

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="mb-6">
              <View className="flex-row items-center rounded-full bg-white border border-[#919EAB52] px-4 py-3">
                <TextInput
                  placeholder="Mật khẩu"
                  placeholderTextColor="#94A3B8"
                  className="flex-1 ml-3 text-base text-[#0F172A]"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        {/* CTA */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`h-12 rounded-full items-center justify-center bg-primary-main border border-primary-dark ${
            loading ? 'opacity-60' : ''
          }`}
        >
          <Text className="text-white text-base font-semibold">
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </Text>
        </Pressable>

        {/* Login */}
        <Pressable onPress={() => router.push(ERouteTable.SIGIN_IN)}>
          <Text className="text-center text-sm text-secondary mt-6">
            Đã có tài khoản? <Text className="underline text-primary">Đăng nhập</Text>
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

import { View, Text, ScrollView, Image, Alert, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'

import { images } from '../../constants'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import { getAuthUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '', password: ''
  })

  const handleSubmit = async () => {
    if (form.email == '' || form.password == '') 
    {
      Alert.alert('Error', 'Both email and password are required.')

      return
    }

    setIsSubmitting(true)

    try {
      await signIn(form.email, form.password)

      const response = await getAuthUser()

      setUser(response)
      setIsLoggedIn(true)

      Alert.alert('Success', 'Successfully signed in.')
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-6"
        style={{
          minHeight: Dimensions.get("window").height - 100,
        }}>
          <Image
            source={images.logo}
            resizeMode='contain'
            className="w-[115px] h-[34px]"
          />

          <Text className="text-2xl font-semibold text-white mt-10 
          font-psemibold">
            Sign in to Aora
          </Text>

          <InputField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5"
            keyboardType="email-address"
          />
          <InputField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
          />

          <Button
            title={'Sign In'}
            handlePress={handleSubmit}
            containerStyles={'mt-5'}
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-1">
            <Text className="text-sm text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-sm font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
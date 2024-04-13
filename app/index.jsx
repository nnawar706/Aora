import { StatusBar } from 'expo-status-bar';
import { ScrollView, Image, Text, View } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
import Button from '../components/Button';

export default function App() {

  const handlePress = () => {
    router.push('/sign-in')
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full min-h-[85vh] justify-center items-center px-4">
          <Image 
            source={images.logo}
            resizeMode='contain'
            className="w-[120px] h-[80px]"
          />

          <Image
            source={images.cards}
            resizeMode='contain'
            className="max-w-[380px] w-full h-[300px]"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image
              source={images.path}
              resizeMode='contain'
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
            />
          </View>
          <Text className="mt-7 text-gray-100 text-xs text-center font-pregular">
            Where creativity meets innovation: embark on a journey of limitless explorations with Aora
          </Text>
          <Button 
            title={'Get Started'}
            handlePress={handlePress}
            containerStyles='w-full mt-5'
            textStyles='text-white'
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
}

import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { useGlobalContext } from '../../context/GlobalProvider'
import useFetch from '../../lib/useFetch'
import { SignAuthUserOut, getPostsByUser } from '../../lib/appwrite'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import { icons } from '../../constants'
import Header from '../../components/Header'

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  const { data: posts } = useFetch(() => getPostsByUser(user?.$id))
  
  const signOut = async () => {
    await SignAuthUserOut()

    setUser(null)
    setIsLoggedIn(false)

    router.replace('/sign-in')
  }
  
  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Card
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No video found"
            subtitle="You haven't posted anything yet."
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity 
            className="flex w-full items-end mb-10"
            onPress={signOut}>
              <Image 
                source={icons.logout}
                resizeMode='contain'
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg
            flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <Header 
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <Header
                title={posts.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              {/* <Header
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              /> */}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

export default Profile

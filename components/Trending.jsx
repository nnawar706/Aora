import { View, Text, FlatList } from 'react-native'
import React from 'react'

const Trending = ({ data }) => {
  return (
    <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.$id}
        renderItem={(item) => (
            <Text>{item.$id}</Text>
        )}
        contentOffset={{ x: 170 }}
    />
  )
}

export default Trending
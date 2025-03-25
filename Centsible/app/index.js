import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {Link, useRouter} from 'expo-router'
import service from './../utils/services'

export default function Home() {
  const router = useRouter();
  useEffect(()=> {
    checkUserAuth();
  }, [])

  const checkUserAuth = async() => {
    const result = await services.getData('login');
    if(result != 'true') {
      router.replace('/login')
    }
    console.log("Result", result);
  }
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    
})
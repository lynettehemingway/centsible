import React, { useEffect, useState } from 'react'
import { useRouter, Stack } from 'expo-router';
import service from '../../utils/services'

export default function AuthLayout() {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    useEffect(()=> {
        checkUserAuth();
      }, [])
    
      const checkUserAuth = async() => {
        const result = await service.getData('userAuthToken');
        if(result != 'temp_true') {
          router.replace('/login');
        }
        setAuthenticated(true);
      }

    if (!isAuthenticated) return <></>;
    return (<Stack screenOptions={{headerShown:false}}/>);
}
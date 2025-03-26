import React, { useEffect, useState } from 'react';
import { useRouter, Stack } from 'expo-router';
import {API_URL} from '@env';
import service from '../../utils/services';


export default function AuthLayout() {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const router = useRouter();
    useEffect(()=> {
        checkUserAuth();
      }, [])
    
      const checkUserAuth = async() => {
        const userAuthToken = await service.getData('userAuthToken');
        console.log(userAuthToken);
        if (!userAuthToken) router.replace('/login');

        const response = await fetch(`${API_URL}/users/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userAuthToken}`
          },
        });



        if (response.ok) setAuthenticated(true);
        else router.replace('/login');
      }

    if (!isAuthenticated) return <></>;
    return (<Stack screenOptions={{headerShown:false}}/>);
}
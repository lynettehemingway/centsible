import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import service from '../utils/services';


export default function Index() {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const [isAuthenticated, setAuthenticated] = useState<'check' | 'auth' | 'noauth'>('check');
    
    useEffect(()=> {
        const checkUserAuth = async() => {
        const userAuthToken = await service.getData('userAuthToken');
        console.log(userAuthToken);
        if (!userAuthToken){
            setAuthenticated('noauth');
            return;
        }

        try {
        const response = await fetch(`${API_URL}/users/`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${userAuthToken}`
            },
        });



        if (response.ok) setAuthenticated('auth');
        else setAuthenticated('noauth');
        }
        catch (err) {
            setAuthenticated('noauth');
        }
        }

        checkUserAuth();
      }, [])

      if (isAuthenticated === 'check') return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
      )
      if (isAuthenticated === 'auth') return <Redirect href="/(logged-in)" />;
    
      return <Redirect href="/login"/>;
}
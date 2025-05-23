import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from './context/AuthContext';

function RootLayoutNav() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirigir a login si no está autenticado
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirigir a la página principal si está autenticado
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
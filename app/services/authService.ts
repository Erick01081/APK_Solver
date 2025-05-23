import AsyncStorage from '@react-native-async-storage/async-storage';
const API_BASE_URL = 'http://backsolver-8106099.us-east-2.elb.amazonaws.com'; // por ejemplo, http://192.168.0.10:8080

export async function login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error('Credenciales incorrectas');
    }

    const data = await response.json();
    if (data.token) {
        AsyncStorage.setItem('token', data.token);
    }
}

export async function register(userData: any) {
    console.log(userData);
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error en el registro');
    }

    return;
}

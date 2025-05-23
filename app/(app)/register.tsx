import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { register } from '../services/authService';
import { v4 as uuidv4 } from 'uuid';

export default function RegisterScreen() {
    const [form, setForm] = useState({
        id: `user-${uuidv4()}`, // ID generado automáticamente
        name: '',
        email: '',
        phoneNumber: '',
        city: '',
        password: '',
        documentType: 'CC', // Valor por defecto CC
        documentNumber: '',
        profile: '',
        role: 'USER',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const documentTypes = ['CC', 'TI', 'CE']; // Opciones para tipo de documento

    const handleChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value });
    };

    const handleRegister = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            console.log("Enviando datos de registro...");

            // Validaciones
            if (!form.name || !form.email || !form.password || !form.documentNumber) {
                throw new Error('Por favor completa todos los campos requeridos');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.email)) {
                throw new Error('Por favor ingresa un email válido');
            }

            // Enviar formulario sin esperar respuesta JSON
            await register(form);
            console.log("Registro enviado con éxito");

            // Redirigir directamente sin esperar respuesta estructurada
            router.replace({
                pathname: '/login',
                params: { prefillEmail: form.email }
            });

        } catch (error: any) {
            console.error("Error en registro:", error);
            Alert.alert('Error', error.message || 'Error al registrar');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Registrarse</Text>

            {/* Campos del formulario */}
            <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                onChangeText={(text) => handleChange('name', text)}
                value={form.name}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => handleChange('email', text)}
                value={form.email}
            />

            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                onChangeText={(text) => handleChange('phoneNumber', text)}
                value={form.phoneNumber}
            />

            <TextInput
                style={styles.input}
                placeholder="Ciudad"
                onChangeText={(text) => handleChange('city', text)}
                value={form.city}
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry
                onChangeText={(text) => handleChange('password', text)}
                value={form.password}
            />

            {/* Selector para tipo de documento */}
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Tipo de documento:</Text>
                <Picker
                    selectedValue={form.documentType}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleChange('documentType', itemValue)}>
                    {documentTypes.map((type) => (
                        <Picker.Item key={type} label={type} value={type} />
                    ))}
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Número de documento"
                keyboardType="numeric"
                onChangeText={(text) => handleChange('documentNumber', text)}
                value={form.documentNumber}
            />

            <TextInput
                style={styles.input}
                placeholder="Perfil (opcional)"
                onChangeText={(text) => handleChange('profile', text)}
                value={form.profile}
            />

            <View style={styles.buttonContainer}>
                <Button title="Registrarse" onPress={handleRegister} />
            </View>

            <Text style={styles.link} onPress={() => router.push('/login')}>
                ¿Ya tienes cuenta? Inicia sesión
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
        borderRadius: 5,
    },
    pickerContainer: {
        marginBottom: 12,
    },
    pickerLabel: {
        marginBottom: 4,
        color: '#666',
    },
    picker: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    buttonContainer: {
        marginTop: 16,
        marginBottom: 12,
    },
    link: {
        marginTop: 16,
        color: 'blue',
        textAlign: 'center'
    },
});
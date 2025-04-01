import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Image, TextInput, Alert, Modal, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/theme';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const applications = [
  {
    id: '1',
    jobTitle: 'House Moving Help',
    date: '2024-02-15',
    status: 'Pending',
  },
  {
    id: '2',
    jobTitle: 'Garden Maintenance',
    date: '2024-02-10',
    status: 'Accepted',
  },
  {
    id: '3',
    jobTitle: 'Event Setup',
    date: '2024-02-05',
    status: 'Completed',
  },
];

// Interfaz para las ciudades
interface City {
  id: string;
  name: string;
  department: string;
}

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+57 300 123 4567',
    location: 'Bogotá, Cundinamarca',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
  });

  const [tempData, setTempData] = useState(profileData);
  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar ciudades de Colombia
  useEffect(() => {
    // Simulación de carga de ciudades desde una API
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        // En producción, aquí harías la llamada a la API real
        // const response = await fetch('https://api.ejemplo.com/ciudades-colombia');
        // const data = await response.json();

        // Por ahora, simularemos con datos estáticos
        const colombianCities: City[] = [
          { id: '1', name: 'Bogotá', department: 'Cundinamarca' },
          { id: '2', name: 'Medellín', department: 'Antioquia' },
          { id: '3', name: 'Cali', department: 'Valle del Cauca' },
          { id: '4', name: 'Barranquilla', department: 'Atlántico' },
          { id: '5', name: 'Cartagena', department: 'Bolívar' },
          { id: '6', name: 'Santa Marta', department: 'Magdalena' },
          { id: '7', name: 'Bucaramanga', department: 'Santander' },
          { id: '8', name: 'Pereira', department: 'Risaralda' },
          { id: '9', name: 'Manizales', department: 'Caldas' },
          { id: '10', name: 'Villavicencio', department: 'Meta' },
          { id: '11', name: 'Pasto', department: 'Nariño' },
          { id: '12', name: 'Neiva', department: 'Huila' },
          { id: '13', name: 'Armenia', department: 'Quindío' },
          { id: '14', name: 'Popayán', department: 'Cauca' },
          { id: '15', name: 'Ibagué', department: 'Tolima' },
          { id: '16', name: 'Tunja', department: 'Boyacá' },
          { id: '17', name: 'Valledupar', department: 'Cesar' },
          { id: '18', name: 'Montería', department: 'Córdoba' },
          { id: '19', name: 'Sincelejo', department: 'Sucre' },
          { id: '20', name: 'Riohacha', department: 'La Guajira' },
        ];

        setCities(colombianCities);
        setFilteredCities(colombianCities);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
        Alert.alert('Error', 'No se pudieron cargar las ciudades de Colombia');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filtrar ciudades basado en la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(
        city =>
          city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          city.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchQuery, cities]);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
  };

  const handleSelectCity = (city: City) => {
    setTempData({ ...tempData, location: `${city.name}, ${city.department}` });
    setCitiesModalVisible(false);
  };

  const handleAvatarChange = async () => {
    if (!isEditing) return;

    // Solicitar permiso para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería de imágenes.');
      return;
    }

    // Configuración del selector de imágenes
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        // Actualizar la imagen de perfil en los datos temporales
        setTempData({
          ...tempData,
          avatar: result.assets[0].uri
        });
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      console.error('Error al seleccionar imagen:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1a1a1a' : '#f8f9fa',
    },
    header: {
      padding: 16,
      paddingTop: 60,
      backgroundColor: isDark ? '#2d2d2d' : '#fff',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatarContainer: {
      position: 'relative',
      marginRight: 16,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    editAvatarButton: {
      position: 'absolute',
      right: -4,
      bottom: -4,
      backgroundColor: '#007AFF',
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nameContainer: {
      flex: 1,
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
      marginBottom: 4,
    },
    email: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#666',
    },
    section: {
      backgroundColor: isDark ? '#2d2d2d' : '#fff',
      padding: 16,
      marginBottom: 16,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
    },
    editButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    editButtonText: {
      color: '#007AFF',
      fontSize: 16,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    rowText: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    input: {
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      padding: 0,
      flex: 1,
      textAlign: 'right',
    },
    locationInput: {
      fontSize: 16,
      color: isDark ? '#007AFF' : '#007AFF',
      padding: 0,
      flex: 1,
      textAlign: 'right',
    },
    applicationCard: {
      backgroundColor: isDark ? '#333' : '#fff',
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#eee',
    },
    jobTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#fff' : '#000',
      marginBottom: 8,
    },
    applicationInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    date: {
      color: isDark ? '#ccc' : '#666',
    },
    status: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
    },
    statusText: {
      fontSize: 14,
      fontWeight: '500',
    },
    // Estilos para el modal de selección de ciudades
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      flex: 1,
      marginTop: 100,
      marginBottom: 0,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#000',
    },
    searchContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    searchInput: {
      backgroundColor: isDark ? '#333' : '#f2f2f2',
      borderRadius: 10,
      padding: 12,
      color: isDark ? '#fff' : '#000',
    },
    cityItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    cityName: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#fff' : '#000',
    },
    cityDepartment: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      marginTop: 4,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending':
        return {
          backgroundColor: isDark ? '#423500' : '#fff3cd',
          color: isDark ? '#ffd700' : '#856404',
        };
      case 'Accepted':
        return {
          backgroundColor: isDark ? '#1e4620' : '#d4edda',
          color: isDark ? '#4caf50' : '#155724',
        };
      case 'Completed':
        return {
          backgroundColor: isDark ? '#1a365d' : '#cce5ff',
          color: isDark ? '#63b3ed' : '#004085',
        };
      default:
        return {
          backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa',
          color: isDark ? '#fff' : '#000',
        };
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: tempData.avatar }}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={handleAvatarChange}
              >
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.nameContainer}>
            {isEditing ? (
              <TextInput
                style={styles.name}
                value={tempData.name}
                onChangeText={(text) => setTempData({ ...tempData, name: text })}
                placeholderTextColor={isDark ? '#999' : '#666'}
              />
            ) : (
              <Text style={styles.name}>{profileData.name}</Text>
            )}
            <Text style={styles.email}>{profileData.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditing) {
                handleSave();
              } else {
                setTempData(profileData);
                setIsEditing(true);
              }
            }}>
            <Ionicons
              name={isEditing ? "checkmark" : "create-outline"}
              size={20}
              color="#007AFF"
            />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowText}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={tempData.phone}
              onChangeText={(text) => setTempData({ ...tempData, phone: text })}
              keyboardType="phone-pad"
              placeholderTextColor={isDark ? '#999' : '#666'}
            />
          ) : (
            <Text style={styles.rowText}>{profileData.phone}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Location</Text>
          {isEditing ? (
            <TouchableOpacity onPress={() => setCitiesModalVisible(true)}>
              <Text style={styles.locationInput}>{tempData.location} <Ionicons name="chevron-down" size={14} color="#007AFF" /></Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.rowText}>{profileData.location}</Text>
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText}>Member Since</Text>
          <Text style={styles.rowText}>January 2024</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application History</Text>
        {applications.map((application) => (
          <View key={application.id} style={styles.applicationCard}>
            <Text style={styles.jobTitle}>{application.jobTitle}</Text>
            <View style={styles.applicationInfo}>
              <Text style={styles.date}>{application.date}</Text>
              <View style={[styles.status, { backgroundColor: getStatusStyle(application.status).backgroundColor }]}>
                <Text style={[styles.statusText, { color: getStatusStyle(application.status).color }]}>
                  {application.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.row}>
          <Text style={styles.rowText}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDark ? '#007AFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Modal para seleccionar ciudades de Colombia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={citiesModalVisible}
        onRequestClose={() => setCitiesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Ciudad</Text>
              <TouchableOpacity onPress={() => setCitiesModalVisible(false)}>
                <Ionicons name="close" size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar ciudad o departamento..."
                placeholderTextColor={isDark ? '#999' : '#666'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={{ color: isDark ? '#fff' : '#000' }}>Cargando ciudades...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleSelectCity(item)}
                  >
                    <Text style={styles.cityName}>{item.name}</Text>
                    <Text style={styles.cityDepartment}>{item.department}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: isDark ? '#fff' : '#000' }}>
                      No se encontraron ciudades con ese nombre
                    </Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
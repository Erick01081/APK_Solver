import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/theme';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Interfaz para las ciudades
interface City {
  id: string;
  name: string;
  department: string;
}

export default function PostJob() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [pay, setPay] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [jobImage, setJobImage] = useState<string | null>(null);


  // Estados para el selector de ciudades
  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Colores dinámicos basados en el tema
  const colors = {
    background: isDark ? '#121212' : '#fff',
    text: isDark ? '#fff' : '#333',
    subtitle: isDark ? '#aaa' : '#666',
    border: isDark ? '#444' : '#ddd',
    input: isDark ? '#222' : '#fff',
    buttonBg: '#007AFF',
    buttonText: '#fff',
    headerBorder: isDark ? '#333' : '#f0f0f0',
    placeholderText: isDark ? '#777' : '#999',
    modalBackground: isDark ? '#1a1a1a' : '#fff',
    modalOverlay: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    searchBackground: isDark ? '#333' : '#f2f2f2',
  };

  // Cargar ciudades colombianas
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        // En producción, aquí harías la llamada a la API real
        // const response = await fetch('https://api.ejemplo.com/ciudades-colombia');
        // const data = await response.json();

        // Simulación con datos estáticos
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
          { id: '21', name: 'Quibdó', department: 'Chocó' },
          { id: '22', name: 'Yopal', department: 'Casanare' },
          { id: '23', name: 'Mocoa', department: 'Putumayo' },
          { id: '24', name: 'Arauca', department: 'Arauca' },
          { id: '25', name: 'Florencia', department: 'Caquetá' },
        ];

        setCities(colombianCities);
        setFilteredCities(colombianCities);
      } catch (error) {
        console.error('Error al cargar ciudades:', error);
        alert('No se pudieron cargar las ciudades de Colombia');
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

  const handleSelectCity = (city: City) => {
    setLocation(`${city.name}, ${city.department}`);
    setCitiesModalVisible(false);
  };

  const handleImagePick = async () => {
    // Solicitar permiso para acceder a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Se necesita permiso para acceder a la galería de imágenes.');
      return;
    }

    // Lanzar el selector de imágenes
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      // @ts-ignore
      setJobImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!title || !location || !pay || !duration || !description) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token de autenticación');

      // Validación y conversión del pago
      const payValue = parseInt(pay, 10);
      if (isNaN(payValue) || payValue <= 0) {
        throw new Error('El pago debe ser un número válido mayor que cero');
      }
      const generateJobId = () => {
        const timestamp = Date.now();
        const randomPart = Math.floor(Math.random() * 1000000);
        return `job-${timestamp}-${randomPart}`;
      };
      // Generar ID único
      const jobId = generateJobId();

      // Crear objeto con la estructura exacta que espera DynamoDB
      const jobData = {
        id: jobId, // Campo ID como clave primaria
        title: title.trim(),
        location: location.trim(),
        pay: payValue,
        duration: duration.trim(),
        description: description.trim(),
        image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.linkedin.com%2Fpulse%2F100-free-image-url-testing-guest-posting-sites-sv0xf&psig=AOvVaw2hzXLD7RoVNLeUQalN_wl4&ust=1748041054665000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCID6wMGWuI0DFQAAAAAdAAAAABAE" // Asegurar que siempre haya un valor
      };

      console.log('Datos a enviar:', JSON.stringify(jobData, null, 2));

      const response = await fetch('http://localhost:8080/jobs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      // Manejo mejorado de la respuesta
      const responseData = await response.text();

      if (!response.ok) {
        console.error('Error del servidor:', response.status, responseData);
        throw new Error(
          response.status === 400
            ? 'Error en los datos enviados. Verifica la información.'
            : `Error del servidor: ${response.status}`
        );
      }

      // Intentar parsear la respuesta solo si es necesario
      let result;
      try {
        result = JSON.parse(responseData);
      } catch {
        result = responseData;
      }

      console.log('Trabajo creado con éxito:', result);
      alert('¡Trabajo publicado con éxito!');

      // Resetear formulario
      resetForm();

    } catch (error) {
      console.error('Error al publicar trabajo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setPay('');
    setDuration('');
    setDescription('');
    setJobImage(null);
  };
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.headerBorder }]}>
        <Text style={[styles.title, { color: colors.text }]}>Post a Job</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Job Title</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., House Moving Help"
            placeholderTextColor={colors.placeholderText}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Location</Text>
          <TouchableOpacity
            style={[styles.inputWithIcon, { backgroundColor: colors.input, borderColor: colors.border }]}
            onPress={() => setCitiesModalVisible(true)}
          >
            <Ionicons name="location-outline" size={20} color={isDark ? '#aaa' : '#666'} style={styles.inputIcon} />
            <Text
              style={[
                styles.inputText,
                { color: location ? colors.text : colors.placeholderText }
              ]}
            >
              {location || "Seleccionar ciudad en Colombia"}
            </Text>
            <Ionicons name="chevron-down" size={16} color={isDark ? '#aaa' : '#666'} style={{ marginRight: 12 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Pay Rate ($/hr)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
              value={pay}
              onChangeText={setPay}
              placeholder="25"
              placeholderTextColor={colors.placeholderText}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 4-5 hours"
              placeholderTextColor={colors.placeholderText}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Job Image</Text>
          <TouchableOpacity
            style={[styles.imageUploadContainer, { backgroundColor: colors.input, borderColor: colors.border }]}
            onPress={handleImagePick}
          >
            {jobImage ? (
              <Image source={{ uri: jobImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera-outline" size={32} color={isDark ? '#aaa' : '#666'} />
                <Text style={[styles.uploadText, { color: colors.subtitle }]}>
                  Toca para subir una imagen
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {jobImage && (
            <TouchableOpacity style={styles.changeImageButton} onPress={handleImagePick}>
              <Text style={styles.changeImageText}>Cambiar imagen</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the job requirements and responsibilities..."
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar ciudades de Colombia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={citiesModalVisible}
        onRequestClose={() => setCitiesModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.modalOverlay }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Seleccionar Ciudad</Text>
              <TouchableOpacity onPress={() => setCitiesModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
              <TextInput
                style={[styles.searchInput, { backgroundColor: colors.searchBackground, color: colors.text }]}
                placeholder="Buscar ciudad o departamento..."
                placeholderTextColor={colors.placeholderText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={{ color: colors.text }}>Cargando ciudades...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.cityItem, { borderBottomColor: colors.border }]}
                    onPress={() => handleSelectCity(item)}
                  >
                    <Text style={[styles.cityName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.cityDepartment, { color: colors.subtitle }]}>{item.department}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={{ color: colors.text }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
  },
  inputIcon: {
    padding: 12,
  },
  inputText: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  imageUploadContainer: {
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  changeImageButton: {
    marginTop: 8,
    alignItems: 'center',
  },
  changeImageText: {
    color: '#007AFF',
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para el modal y selector de ciudades
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    marginTop: 100,
    marginBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cityItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '500',
  },
  cityDepartment: {
    fontSize: 14,
    marginTop: 4,
  }
});
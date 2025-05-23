import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface City {
  id: string;
  name: string;
  department: string;
}

interface Job {
  id: number;
  title: string;
  location: string;
  pay: number;
  duration: string;
  image: string;
}

export default function JobsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    minPay: '',
    duration: '',
  });

  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
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
          // Agrega más si deseas
        ];
        setCities(colombianCities);
        setFilteredCities(colombianCities);
      } catch (error) {
        alert('No se pudieron cargar las ciudades');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:8080/jobs', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Error al obtener los trabajos');

        const data = await response.json();
        console.log('Datos recibidos:', data);
        setJobs(data);

      } catch (error) {
        alert('No se pudieron cargar los trabajos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (citySearchQuery.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(
        (city) =>
          city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
          city.department.toLowerCase().includes(citySearchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearchQuery, cities]);

  const handleSelectCity = (city: City) => {
    setSelectedFilters({ ...selectedFilters, location: `${city.name}, ${city.department}` });
    setCitiesModalVisible(false);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      !selectedFilters.location ||
      job.location.toLowerCase().includes(selectedFilters.location.toLowerCase());

    const matchesMinPay =
      !selectedFilters.minPay || job.pay >= parseInt(selectedFilters.minPay);

    const matchesDuration =
      !selectedFilters.duration ||
      job.duration.toLowerCase().includes(selectedFilters.duration.toLowerCase());

    return matchesSearch && matchesLocation && matchesMinPay && matchesDuration;
  });

  const renderJob = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <Image source={{ uri: item.image }} style={styles.jobImage} />
      <View style={styles.jobContent}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
        <Text style={styles.jobPay}>Pago: ${item.pay}</Text>
        <Text style={styles.jobDuration}>Duración: {item.duration}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trabajos Disponibles</Text>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder="Buscar..."
            placeholderTextColor={isDark ? '#888' : '#aaa'}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="filter" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
        {showFilters && (
          <View style={styles.filterContainer}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Filtros</Text>
              <TouchableOpacity onPress={() => setSelectedFilters({ location: '', minPay: '', duration: '' })}>
                <Text style={styles.clearFiltersText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Ubicación</Text>
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={() => setCitiesModalVisible(true)}
              >
                <Text style={selectedFilters.location ? styles.locationText : styles.locationPlaceholder}>
                  {selectedFilters.location || 'Selecciona una ciudad'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Pago mínimo</Text>
              <TextInput
                keyboardType="numeric"
                value={selectedFilters.minPay}
                onChangeText={(text) => setSelectedFilters({ ...selectedFilters, minPay: text })}
                style={styles.filterInput}
              />
            </View>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Duración</Text>
              <TextInput
                value={selectedFilters.duration}
                onChangeText={(text) => setSelectedFilters({ ...selectedFilters, duration: text })}
                style={styles.filterInput}
              />
            </View>
          </View>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderJob}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Modal visible={citiesModalVisible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.title}>Selecciona una ciudad</Text>
          <TextInput
            placeholder="Buscar ciudad..."
            value={citySearchQuery}
            onChangeText={setCitySearchQuery}
            style={styles.searchInput}
            placeholderTextColor={isDark ? '#888' : '#aaa'}
          />
          <FlatList
            data={filteredCities}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectCity(item)}
                style={{ padding: 12, borderBottomWidth: 1, borderColor: '#ccc' }}
              >
                <Text style={{ color: isDark ? '#fff' : '#000' }}>
                  {item.name}, {item.department}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            onPress={() => setCitiesModalVisible(false)}
            style={{ padding: 16, backgroundColor: '#007AFF', alignItems: 'center' }}
          >
            <Text style={{ color: '#fff' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  // Estilos iguales a los definidos por ti, completados
  // Puedes conservar los que ya tienes: container, header, title, searchBarContainer, etc.
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 22,
    paddingLeft: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#000',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
    fontWeight: '500',
  },
  filterInput: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#000',
  },
  locationSelector: {
    height: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    color: '#000',
    flex: 1,
  },
  locationPlaceholder: {
    color: '#666',
    flex: 1,
  },
  filterRow: {
    marginBottom: 12,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  clearFiltersText: {
    color: '#007AFF',
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  jobImage: {
    width: '100%',
    height: 160,
  },
  jobContent: {
    padding: 16,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  jobLocation: {
    color: '#666',
    marginBottom: 4,
  },
  jobPay: {
    color: '#333',
  },
  jobDuration: {
    color: '#333',
  },
});
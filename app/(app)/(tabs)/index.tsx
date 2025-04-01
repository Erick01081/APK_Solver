import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { jobs } from '../../../data/jobs';
import { useTheme } from '../../../context/theme';

// Interfaz para las ciudades
interface City {
  id: string;
  name: string;
  department: string;
}

export default function JobsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: '',
    minPay: '',
    duration: '',
  });

  // Estados para el selector de ciudades
  const [citiesModalVisible, setCitiesModalVisible] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar ciudades colombianas
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
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
    if (citySearchQuery.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(
        city =>
          city.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
          city.department.toLowerCase().includes(citySearchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearchQuery, cities]);

  const handleSelectCity = (city: City) => {
    setSelectedFilters({...selectedFilters, location: `${city.name}, ${city.department}`});
    setCitiesModalVisible(false);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = !selectedFilters.location ||
      job.location.toLowerCase().includes(selectedFilters.location.toLowerCase());

    const matchesMinPay = !selectedFilters.minPay ||
      job.pay >= parseInt(selectedFilters.minPay);

    const matchesDuration = !selectedFilters.duration ||
      job.duration.toLowerCase().includes(selectedFilters.duration.toLowerCase());

    return matchesSearch && matchesLocation && matchesMinPay && matchesDuration;
  });

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
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDark ? '#fff' : '#000',
    },
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 22,
      paddingLeft: 16,
    },
    searchInput: {
      flex: 1,
      height: 44,
      color: isDark ? '#fff' : '#000',
    },
    searchIcon: {
      marginRight: 8,
    },
    filterButton: {
      width: 44,
      height: 44,
      borderTopRightRadius: 22,
      borderBottomRightRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#444' : '#e0e0e0',
    },
    filterContainer: {
      backgroundColor: isDark ? '#2d2d2d' : '#fff',
      padding: 16,
      borderRadius: 12,
      marginTop: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    filterInput: {
      height: 40,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 8,
      paddingHorizontal: 12,
      color: isDark ? '#fff' : '#000',
    },
    locationSelector: {
      height: 40,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      borderRadius: 8,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    locationText: {
      color: isDark ? '#fff' : '#000',
      flex: 1,
    },
    locationPlaceholder: {
      color: isDark ? '#999' : '#666',
      flex: 1,
    },
    filterLabel: {
      fontSize: 14,
      marginBottom: 4,
      color: isDark ? '#ccc' : '#666',
      fontWeight: '500',
    },
    filterRow: {
      marginBottom: 12,
    },
    applyButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    applyButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
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
      color: isDark ? '#fff' : '#000',
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
      backgroundColor: isDark ? '#2d2d2d' : '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
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
      color: isDark ? '#fff' : '#000',
    },
    jobLocation: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
      marginBottom: 12,
    },
    jobFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    jobPay: {
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
    },
    jobTime: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#666',
    },
    // Estilos para el modal y selector de ciudades
    modalContainer: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      flex: 1,
      marginTop: 100,
      marginBottom: 0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
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
    modalSearchContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    modalSearchInput: {
      borderRadius: 10,
      padding: 12,
      fontSize: 16,
      backgroundColor: isDark ? '#333' : '#f5f5f5',
      color: isDark ? '#fff' : '#000',
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
      borderBottomColor: isDark ? '#333' : '#f0f0f0',
    },
    cityName: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#fff' : '#000',
    },
    cityDepartment: {
      fontSize: 14,
      marginTop: 4,
      color: isDark ? '#aaa' : '#666',
    }
  });

  const clearFilters = () => {
    setSelectedFilters({
      location: '',
      minPay: '',
      duration: '',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Work</Text>

        {/* Barra de búsqueda con icono y botón de filtro */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search-outline" size={20} color={isDark ? '#aaa' : '#666'} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor={isDark ? '#999' : '#666'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}>
            <Ionicons
              name={showFilters ? "options" : "options-outline"}
              size={24}
              color={isDark ? '#fff' : '#333'}
            />
          </TouchableOpacity>
        </View>

        {/* Panel de filtros mejorado */}
        {showFilters && (
          <View style={styles.filterContainer}>
            <View style={styles.filtersHeader}>
              <Text style={styles.filtersTitle}>Filters</Text>
              <TouchableOpacity onPress={clearFilters}>
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Location</Text>
              <TouchableOpacity
                style={styles.locationSelector}
                onPress={() => setCitiesModalVisible(true)}>
                {selectedFilters.location ? (
                  <Text style={styles.locationText}>{selectedFilters.location}</Text>
                ) : (
                  <Text style={styles.locationPlaceholder}>Seleccionar ciudad en Colombia</Text>
                )}
                <Ionicons name="chevron-down" size={16} color={isDark ? '#aaa' : '#666'} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Minimum Pay ($/hr)</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Enter minimum pay"
                placeholderTextColor={isDark ? '#999' : '#666'}
                keyboardType="numeric"
                value={selectedFilters.minPay}
                onChangeText={(text) => setSelectedFilters({...selectedFilters, minPay: text})}
              />
            </View>

            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Duration</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="e.g., 4-5 hours"
                placeholderTextColor={isDark ? '#999' : '#666'}
                value={selectedFilters.duration}
                onChangeText={(text) => setSelectedFilters({...selectedFilters, duration: text})}
              />
            </View>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.jobCard}
            onPress={() => router.push(`/job/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.jobImage} />
            <View style={styles.jobContent}>
              <Text style={styles.jobTitle}>{item.title}</Text>
              <Text style={styles.jobLocation}>
                <Ionicons name="location-outline" size={16} color={isDark ? '#ccc' : '#666'} />
                {' '}{item.location}
              </Text>
              <View style={styles.jobFooter}>
                <Text style={styles.jobPay}>${item.pay}/hr</Text>
                <Text style={styles.jobTime}>{item.duration}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

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

            <View style={styles.modalSearchContainer}>
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Buscar ciudad o departamento..."
                placeholderTextColor={isDark ? '#999' : '#666'}
                value={citySearchQuery}
                onChangeText={setCitySearchQuery}
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
    </View>
  );
}
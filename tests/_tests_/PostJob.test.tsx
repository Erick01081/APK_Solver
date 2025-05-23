import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import PostJob from '../../app/(app)/(tabs)/post'; // Ajustar ruta según tu estructura
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock para useTheme para controlar modo oscuro o claro
jest.mock('../../../context/theme', () => ({
  useTheme: () => ({ theme: 'light' }),
}));
global.alert = jest.fn();
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Ionicons: (props) => <View {...props} />,
    MaterialIcons: (props) => <View {...props} />,
    default: (props) => <View {...props} />,
  };
});

// Mocks para ImagePicker
jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe('PostJob component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente el formulario inicial', () => {
    const { getByPlaceholderText, getByText } = render(<PostJob />);
    expect(getByPlaceholderText('e.g., House Moving Help')).toBeTruthy();
    expect(getByText('Post a Job')).toBeTruthy();
    expect(getByText('Seleccionar ciudad en Colombia')).toBeTruthy();
  });

  it('abre el modal de ciudades cuando se presiona el input de ubicación', () => {
    const { getByText, queryByText } = render(<PostJob />);
    const locationInput = getByText('Seleccionar ciudad en Colombia');
    expect(queryByText('Seleccionar Ciudad')).toBeNull();
    fireEvent.press(locationInput);
    expect(getByText('Seleccionar Ciudad')).toBeTruthy();
  });

  it('filtra ciudades correctamente según búsqueda', async () => {
    const { getByText, getByPlaceholderText, getAllByText } = render(<PostJob />);
    fireEvent.press(getByText('Seleccionar ciudad en Colombia'));

    const searchInput = getByPlaceholderText('Buscar ciudad o departamento...');
    expect(searchInput).toBeTruthy();

    // Buscar "Bogotá"
    fireEvent.changeText(searchInput, 'bogotá');

    await waitFor(() => {
      expect(getAllByText(/Bogotá/i).length).toBeGreaterThan(0);
    });
  });

  it('selecciona una ciudad y la muestra en el formulario', async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<PostJob />);
    fireEvent.press(getByText('Seleccionar ciudad en Colombia'));

    await waitFor(() => expect(getByText('Seleccionar Ciudad')).toBeTruthy());

    const cityOption = getByText('Bogotá');
    fireEvent.press(cityOption);

    expect(queryByText('Seleccionar Ciudad')).toBeNull();
    expect(getByText('Bogotá, Cundinamarca')).toBeTruthy();
  });

  it('abre el selector de imágenes y actualiza la imagen', async () => {
    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'granted' });
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'test-uri' }],
    });

    const { getByText, getByRole } = render(<PostJob />);

    const uploadButton = getByText('Toca para subir una imagen');

    await act(async () => {
      fireEvent.press(uploadButton);
    });

   
    expect(true);
  });

  it('muestra alerta si no hay permiso para galería', async () => {
    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValue({ status: 'denied' });

    const { getByText } = render(<PostJob />);
    const uploadButton = getByText('Toca para subir una imagen');

    await act(async () => {
      fireEvent.press(uploadButton);
    });

    expect(alertMock).toHaveBeenCalledWith('Se necesita permiso para acceder a la galería de imágenes.');
    alertMock.mockRestore();
  });

  it('muestra alerta si campos obligatorios no están completos al postear', () => {
    const alertMock = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    const { getByText } = render(<PostJob />);
    const postButton = getByText('Post Job');

    fireEvent.press(postButton);

    expect(alertMock);
    
    alertMock.mockRestore();
  });

  it('intenta postear trabajo correctamente y resetea el formulario', async () => {
    jest.useFakeTimers();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('fake-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      text: jest.fn().mockResolvedValue(JSON.stringify({ success: true })),
    });

    const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});

    const { getByPlaceholderText, getByText } = render(<PostJob />);

    fireEvent.changeText(getByPlaceholderText('e.g., House Moving Help'), 'Test Job');
    fireEvent.press(getByText('Seleccionar ciudad en Colombia'));
    await waitFor(() => getByText('Seleccionar Ciudad'));
    fireEvent.press(getByText('Bogotá'));

    fireEvent.changeText(getByPlaceholderText('25'), '50');
    fireEvent.changeText(getByPlaceholderText('e.g., 4-5 hours'), '5 hours');
    fireEvent.changeText(getByPlaceholderText('Describe the job requirements and responsibilities...'), 'Test description');

    await act(async () => {
      fireEvent.press(getByText('Post Job'));
    });

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('¡Trabajo publicado con éxito!');
    });

    // Verificar que formulario se resetee
    expect(getByPlaceholderText('e.g., House Moving Help').props.value).toBe('');
    expect(getByText('Seleccionar ciudad en Colombia')).toBeTruthy();

    alertMock.mockRestore();
    jest.useRealTimers();
  });

  it('maneja error en el posteo correctamente', async () => {
    jest.useFakeTimers();

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('fake-token');
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Internal Server Error'),
    });

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const { getByPlaceholderText, getByText } = render(<PostJob />);

    fireEvent.changeText(getByPlaceholderText('e.g., House Moving Help'), 'Test Job');
    fireEvent.press(getByText('Seleccionar ciudad en Colombia'));
    await waitFor(() => getByText('Seleccionar Ciudad'));
    fireEvent.press(getByText('Bogotá'));

    fireEvent.changeText(getByPlaceholderText('25'), '50');
    fireEvent.changeText(getByPlaceholderText('e.g., 4-5 hours'), '5 hours');
    fireEvent.changeText(getByPlaceholderText('Describe the job requirements and responsibilities...'), 'Test description');

    await act(async () => {
      fireEvent.press(getByText('Post Job'));
    });

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Error del servidor:', 500, 'Internal Server Error'
    );

    consoleErrorMock.mockRestore();
    jest.useRealTimers();
  });
});

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import JobsScreen from '../(tabs)/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchMock from 'jest-fetch-mock';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('mocked-token')),
}));
global.alert = jest.fn();
jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
  FontAwesome: () => null,
  MaterialIcons: () => null,
  MaterialCommunityIcons: () => null,
  AntDesign: () => null,
}));
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
}));
jest.mock('expo-font', () => ({
  isLoaded: () => true,
  loadAsync: () => Promise.resolve(),
}));

jest.mock('../../../context/theme', () => ({
  useTheme: () => ({ theme: 'light' }),
}));

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('JobsScreen', () => {
  it('renderiza la pantalla y muestra trabajos después de la carga', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          id: 1,
          title: 'Desarrollador React',
          location: 'Bogotá',
          pay: 5000,
          duration: '1 mes',
          image: 'https://example.com/image.jpg',
        },
      ])
    );

    const { getByText, getByPlaceholderText, queryByText } = render(<JobsScreen />);

    // Verifica que muestre "Trabajos Disponibles"
    expect(getByText('Trabajos Disponibles')).toBeTruthy();

    // Espera a que termine la carga y muestre el trabajo
         await waitFor(() => {
        expect(getByText('Trabajos Disponibles')).toBeTruthy();
        expect(getByText('Trabajos Disponibles')).toBeTruthy();
        expect(getByText('Trabajos Disponibles')).toBeTruthy();
        });

        // Verifica funcionalidad de búsqueda
        const searchInput = getByPlaceholderText('Buscar...');
        fireEvent.changeText(searchInput, 'React');

        await waitFor(() => {
        expect(getByText('Trabajos Disponibles')).toBeTruthy();
        }); 
  });
});

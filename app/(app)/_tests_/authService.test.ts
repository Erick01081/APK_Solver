import { login } from '../../services/authService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('Login Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn() as jest.Mock;
    (AsyncStorage.setItem as jest.Mock) = jest.fn(); // <-- Mock explícito
  });

  it('should successfully login with valid credentials', async () => {
    const mockToken = 'mock-token-123';
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ token: mockToken }),
    });

    await login('test@example.com', 'password123');

    expect(fetch).toHaveBeenCalledWith('http://backsolver-8106099.us-east-2.elb.amazonaws.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test@example.com', password: 'password123' }),
    });
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('token', mockToken);
  });

  it('should throw error with invalid credentials', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(login('wrong@example.com', 'wrongpass'))
      .rejects.toThrow('Credenciales incorrectas');
  });

  it('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(login('test@example.com', 'password123'))
      .rejects.toThrow('Network error');
  });
});

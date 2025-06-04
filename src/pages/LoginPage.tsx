import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Button from '../components/ui/Button';

const LoginPage: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(pin);
      if (success) {
        navigate('/');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric input
    if (/^\d*$/.test(value) && value.length <= 7) {
      setPin(value);
      setError(null);
    }
  };

  return (
    <AuthLayout 
      title="Nhap Admin Login" 
      subtitle="Enter your 6-7 digit PIN to access your hospital dashboard"
    >
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
            Admin PIN
          </label>
          <div className="mt-1">
            <input
              id="pin"
              name="pin"
              type="password"
              inputMode="numeric"
              autoComplete="current-password"
              required
              value={pin}
              onChange={handlePinChange}
              placeholder="Enter your 6-7 digit PIN"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center text-xl tracking-widest"
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={pin.length < 6 || pin.length > 7}
          >
            Log in
          </Button>
        </div>
      </form>

      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Demo Credentials</span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3">
          <div className="text-center text-sm text-gray-600">
            <p>Central Hospital: <span className="font-medium">123456</span></p>
            <p>Mercy Medical Center: <span className="font-medium">654321</span></p>
          </div>
        </div>
      </div> */}
    </AuthLayout>
  );
};

export default LoginPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, RootState, AppDispatch } from '../../redux';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthLayout from '../../layouts/AuthLayout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <AuthLayout>
      <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Log In to Trust Chain</h2>
      <p className='text-sm text-gray-600 text-center mb-6'>Log in with your email to access your dashboard.</p>
      <form onSubmit={handleLogin}>
        <InputField
          label='Email'
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
        />
        <InputField
          label='Password'
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
          className='mt-4'
        />

        {error && <p className='text-red-500 text-sm mb-4 text-center'>{error}</p>}

        <Button type='submit' onClick={() => {}} className='w-full mt-6' disabled={isLoading}>
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>
      </form>
      <p className='text-center text-gray-500 text-sm mt-4'>
        Don't have an account?{' '}
        <a href='/signup' className='text-blue-600 hover:underline'>
          Sign up here
        </a>
      </p>
      <div className='mt-4'>
        <p className='text-center text-purple-950 text-sm'>Example Email : test@example.com</p>
        <p className='text-center text-purple-900 text-sm mt-1'>Example password : password123</p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;

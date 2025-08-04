import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, RootState, AppDispatch } from '../../redux';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthLayout from '../../layouts/AuthLayout';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const resultAction = await dispatch(signup({ email, password }));

    if (signup.fulfilled.match(resultAction)) {
      // Redirection handled by useEffect
    } else if (signup.rejected.match(resultAction)) {
      // Local error state is set by useEffect from Redux state
    }
  };

  return (
    <AuthLayout>
      <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>Create Your Account</h2>
      <p className='text-sm text-gray-600 text-center mb-6'>Sign up to access your Trust Chain dashboard.</p>
      <form onSubmit={handleSignup}>
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
          placeholder='Enter a strong password'
          required
          className='mt-4'
        />
        <InputField
          label='Confirm Password'
          id='confirmPassword'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder='Confirm your password'
          required
          className='mt-4'
        />

        {localError && <p className='text-red-500 text-sm mb-4 text-center'>{localError}</p>}

        <Button type='submit' onClick={() => {}} className='w-full mt-6' disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
      <p className='text-center text-gray-500 text-sm mt-4'>
        Already have an account?{' '}
        <a href='/' className='text-blue-600 hover:underline'>
          Log in here
        </a>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;

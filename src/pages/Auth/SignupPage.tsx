import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup, RootState, AppDispatch } from '../../redux';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import AuthLayout from '../../layouts/AuthLayout';

const SignupPage: React.FC = () => {
  const [name, setName] = useState(''); // <-- NEW STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, isLoading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home', { replace: true });
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

    // Pass the name to the signup thunk
    const resultAction = await dispatch(signup({ email, password, name })); // <-- NAME ADDED

    if (signup.fulfilled.match(resultAction)) {
      // Redirection handled by useEffect
    } else if (signup.rejected.match(resultAction)) {
      // Local error state is set by useEffect from Redux state
    }
  };

  return (
    <AuthLayout>
      <h2 className='mb-6 text-2xl font-bold text-center text-gray-800'>Create Your Account</h2>
      <p className='mb-6 text-sm text-center text-gray-600'>Sign up to access your Trust Chain dashboard.</p>
      <form onSubmit={handleSignup}>
        <InputField
          label='Full Name'
          id='name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter your full name'
          required
        />
        <InputField
          label='Email'
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
          className='mt-4'
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

        {localError && <p className='mb-4 text-sm text-center text-red-500'>{localError}</p>}

        <Button type='submit' className='w-full mt-6' disabled={isLoading} onClick={() => {}}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
      <p className='mt-4 text-sm text-center text-gray-500'>
        Already have an account?{' '}
        <a href='/' className='text-blue-600 hover:underline'>
          Log in here
        </a>
      </p>
    </AuthLayout>
  );
};

export default SignupPage;

import {
  GoogleLogin,
  googleLogout,
  GoogleOAuthProvider,
  CredentialResponse,
} from '@react-oauth/google';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import brainIcon from '../assets/images/brain.png';
import '../App.css';

// Type definitions for JWT payload
interface GoogleUser {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (credentialResponse: CredentialResponse): void => {
    console.log('Successfully logged in!:', credentialResponse);

    if (credentialResponse.credential) {
      try {
        const decode: GoogleUser = jwtDecode(credentialResponse.credential);
        console.log('decoded user info:', decode);
        localStorage.setItem('user', JSON.stringify(decode));
        navigate('/landingpage');
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    } else {
      console.error('No credential found in response');
    }
  };

  const handleError = (): void => {
    console.log('Failed to login!');
  };

  return (
    <div className='fade-in min-h-screen flex items-center justify-center bg-gradient-to-b from-[#022839] to-[#3e3656]'>
      <div className='bg-gradient-to-l from-[#94B0B7] to-[#C2C8C5] p-10 rounded-lg shadow-lg flex flex-col items-center'>
        <div className='flex items-center gap-4 mb-6'>
          <h1 className='text-5xl font-bold text-[#022839]'>AlgoPlaces</h1>
          <img
            src={brainIcon}
            alt='brain icon'
            className='h-12 w-12 object-contain '
          />
        </div>
        <h1 className='text-2xl font-bold mb-6 text-[#022839]'>Sign In</h1>
        <GoogleLogin onSuccess={handleLogin} onError={handleError} />
      </div>
    </div>
  );
};

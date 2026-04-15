import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = ({ onGoogleLogin }) => {
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const googleUser = {
        name: decoded.name || decoded.email?.split('@')[0] || 'Friend',
        avatar: decoded.picture ? '🧑' : '👤',
        email: decoded.email,
        picture: decoded.picture,
        isGoogleLogin: true,
      };
      onGoogleLogin(googleUser);
    } catch (error) {
      console.error('Failed to decode Google token:', error);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <div className="mt-6 text-center">
      <p className="text-gray-500 mb-4">Or sign in with Google</p>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        width="300"
      />
    </div>
  );
};

export default GoogleLoginButton;

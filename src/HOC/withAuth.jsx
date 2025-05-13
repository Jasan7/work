import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../Firebase/firebase'; 

const withAuth = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth); 

    useEffect(() => {
      if (loading) return; // Wait for the user state to load
      if (!user) {
        navigate('/login'); // Redirect to login page if no user is authenticated
      }
    }, [user, loading, navigate]);

    if (loading) {
      return <div>Loading...</div>; 
    }

    return user ? <Component {...props} /> : null; // Render the component only if user is authenticated
  };
};

export default withAuth;

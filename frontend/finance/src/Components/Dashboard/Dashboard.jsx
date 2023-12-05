import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { LoginSignUp } from '../LoginSignUp/LoginSignUp';

export const Dashboard = () => {
  const { user_id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/user/${user_id}`);
        if (response.ok) {
          const userData = await response.json();
          setUserInfo(userData);
        } else {
          // Handle error
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserInfo();
  }, [user_id]);

  const handleLogout = () => {
    // Perform logout functionality here
    // For now, you can simply display a message
    
    navigate('../LoginSignUp/LoginSignUp');
    console.log('Logout clicked');
  };

  return (
    <div>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <h1>Welcome to the Dashboard</h1>
      {userInfo && <p>Hello, {userInfo.name}!</p>}
    </div>
  );
};

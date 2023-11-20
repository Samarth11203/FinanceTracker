import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Dashboard = () => {
  const { user_id } = useParams();
  const [userInfo, setUserInfo] = useState(null);

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

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {userInfo && <p>Hello, {userInfo.name}!</p>}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user_id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [newFamilyMember, setNewFamilyMember] = useState({
    memberName: '',
    memberEmail: '',
    memberPassword: '',
    relationship: '',
  });
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
    navigate('/');
    console.log('Logout clicked');
  };

  const handleAddFamilyMember = async () => {
    // Implement logic to add a family member
    try {
      // Example: Send a request to your server to add a family member
      const response = await fetch('http://localhost:5000/family-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          member_name: newFamilyMember.memberName,
          relationship: newFamilyMember.relationship,
          user_id: userInfo.user_id,
          member_password: newFamilyMember.memberPassword,
          member_email: newFamilyMember.memberEmail,
        }),
      });

      if (response.ok) {
        // Clear the form fields
        setNewFamilyMember({
          memberName: '',
          memberEmail: '',
          memberPassword: '',
          relationship: '',
        });

        // You might want to fetch updated user information after adding a family member
        // This will depend on your application logic
        // fetchUserInfo();
      } else {
        // Handle error
        console.error('Error adding family member:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding family member:', error);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <h1>Welcome to the Dashboard</h1>
      {userInfo && <p>Hello, {userInfo.name}!</p>}

      {/* Conditional rendering based on userInfo.isHead */}
      {userInfo && userInfo.ishead && (
        <div>
          <h2>Add Family Member</h2>
          <div>
            <label>Member Name:</label>
            <input
              type="text"
              value={newFamilyMember.memberName}
              onChange={(e) =>
                setNewFamilyMember((prev) => ({ ...prev, memberName: e.target.value }))
              }
            />
          </div>
          <div>
            <label>Member Email:</label>
            <input
              type="email"
              value={newFamilyMember.memberEmail}
              onChange={(e) =>
                setNewFamilyMember((prev) => ({ ...prev, memberEmail: e.target.value }))
              }
            />
          </div>
          <div>
            <label>Member Password:</label>
            <input
              type="password"
              value={newFamilyMember.memberPassword}
              onChange={(e) =>
                setNewFamilyMember((prev) => ({ ...prev, memberPassword: e.target.value }))
              }
            />
          </div>
          <div>
            <label>Relationship:</label>
            <input
              type="text"
              value={newFamilyMember.relationship}
              onChange={(e) =>
                setNewFamilyMember((prev) => ({ ...prev, relationship: e.target.value }))
              }
            />
          </div>
          <button onClick={handleAddFamilyMember}>Add Family Member</button>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { user_id } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    memberName: '',
    memberEmail: '',
    memberPassword: '',
    relationship: '',
  });
  const [newBudget, setNewBudget] = useState({
    memberId: '',
    budget_name: '',
    budget_amount: '',
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

        // Fetch family members
        const familyMembersResponse = await fetch(`http://localhost:5000/family-members/${user_id}`);
        if (familyMembersResponse.ok) {
          const membersData = await familyMembersResponse.json();
          setFamilyMembers(membersData);
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

        // Refresh the family members list after adding a new member
        const familyMembersResponse = await fetch(`http://localhost:5000/family-members/${user_id}`);
        if (familyMembersResponse.ok) {
          const membersData = await familyMembersResponse.json();
          setFamilyMembers(membersData);
        }

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

  const handleAddBudget = async () => {
    try {
      // Check if memberId and budget_amount are not empty
      if (!newBudget.memberId || !newBudget.budget_amount.trim()) {
        console.error('Member ID or Budget Amount is empty');
        return;
      }
  
      const response = await fetch('http://localhost:5000/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: newBudget.memberId,
          budget_name: newBudget.budget_name,
          budget_amount: parseFloat(newBudget.budget_amount), // Parse as a float or integer
        }),
      });
  
      if (response.ok) {
        // Handle success
        console.log('Budget added successfully!');
        // Reset budget_name and budget_amount
        setNewBudget({
          memberId: newBudget.memberId,
          budget_name: '',
          budget_amount: '',
        });
      } else {
        // Handle error
        console.error('Error adding budget:', response.status);
      }
    } catch (error) {
      console.error('Error during add budget:', error);
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

      {/* Add Budget Section */}

      {userInfo && (
          <div>
            <h2>Add Budget</h2>
            <div>
              <label>Family Member:</label>
              <select
                value={newBudget.memberId}
                onChange={(e) => setNewBudget({ ...newBudget, memberId: e.target.value })}
              >
                <option value={userInfo.user_id}>{userInfo.name} (Self)</option>
                {familyMembers.map((member) => (
                  <option key={member.member_id} value={member.member_id}>
                    {member.member_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Budget Name:</label>
              <input
                type="text"
                value={newBudget.budget_name}
                onChange={(e) => setNewBudget({ ...newBudget, budget_name: e.target.value })}
              />
            </div>
            <div>
              <label>Budget Amount:</label>
              <input
                type="number"
                value={newBudget.budget_amount}
                onChange={(e) => setNewBudget({ ...newBudget, budget_amount: e.target.value })}
              />
            </div>
            <button onClick={handleAddBudget}>Add Budget</button>
          </div>
      )}
      
    </div>
  );
};

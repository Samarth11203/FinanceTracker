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
  const [budgets, setBudgets] = useState([]);
  const [newExpense, setNewExpense] = useState({
    budgetId: '',
    expenseName: '',
    expenseAmount: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await fetch(`http://localhost:5000/user/${user_id}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserInfo(userData);
        }

        // Fetch family members
        const familyMembersResponse = await fetch(`http://localhost:5000/family-members/${user_id}`);
        if (familyMembersResponse.ok) {
          const membersData = await familyMembersResponse.json();
          setFamilyMembers(membersData);
        }

        // Fetch budgets for the user
        const budgetsResponse = await fetch(`http://localhost:5000/budgets/${user_id}`);
        if (budgetsResponse.ok) {
          const budgetsData = await budgetsResponse.json();
          setBudgets(budgetsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user_id]);

  const handleLogout = () => {
    navigate('/');
    console.log('Logout clicked');
  };

  const handleAddFamilyMember = async () => {
    try {
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
        setNewFamilyMember({
          memberName: '',
          memberEmail: '',
          memberPassword: '',
          relationship: '',
        });

        const familyMembersResponse = await fetch(`http://localhost:5000/family-members/${user_id}`);
        if (familyMembersResponse.ok) {
          const membersData = await familyMembersResponse.json();
          setFamilyMembers(membersData);
        }
      } else {
        console.error('Error adding family member:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding family member:', error);
    }
  };

  const handleAddBudget = async () => {
    try {
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
          budget_amount: parseFloat(newBudget.budget_amount),
        }),
      });

      if (response.ok) {
        console.log('Budget added successfully!');
        setNewBudget({
          memberId: newBudget.memberId,
          budget_name: '',
          budget_amount: '',
        });

        const budgetsResponse = await fetch(`http://localhost:5000/budgets/${user_id}`);
        if (budgetsResponse.ok) {
          const budgetsData = await budgetsResponse.json();
          setBudgets(budgetsData);
        }
      } else {
        console.error('Error adding budget:', response.status);
      }
    } catch (error) {
      console.error('Error during add budget:', error);
    }
  };

  const handleAddExpense = async () => {
    try {
      if (!newExpense.budgetId || !newExpense.expenseAmount.trim()) {
        console.error('Budget ID or Expense Amount is empty');
        return;
      }

      const response = await fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user_id,
          budget_id: newExpense.budgetId,
          expense_name: newExpense.expenseName,
          expense_amount: parseFloat(newExpense.expenseAmount),
        }),
      });

      if (response.ok) {
        console.log('Expense added successfully!');
        setNewExpense({
          budgetId: '',
          expenseName: '',
          expenseAmount: '',
        });

        const budgetsResponse = await fetch(`http://localhost:5000/budgets/${user_id}`);
        if (budgetsResponse.ok) {
          const budgetsData = await budgetsResponse.json();
          setBudgets(budgetsData);
        }
      } else {
        console.error('Error adding expense:', response.status);
      }
    } catch (error) {
      console.error('Error during add expense:', error);
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
                <option value={user_id}>{userInfo.name} (Self)</option>
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

      {userInfo && (
        <div>
          <h2>Add Expense</h2>
          <div>
            <label>Budget:</label>
            <select
              value={newExpense.budgetId}
              onChange={(e) => setNewExpense({ ...newExpense, budgetId: e.target.value })}
            >
              <option value="">Select Budget</option>
              {budgets.map((budget) => (
                <option key={budget.budget_id} value={budget.budget_id}>
                  {budget.budget_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Expense Name:</label>
            <input
              type="text"
              value={newExpense.expenseName}
              onChange={(e) => setNewExpense({ ...newExpense, expenseName: e.target.value })}
            />
          </div>
          <div>
            <label>Expense Amount:</label>
            <input
              type="number"
              value={newExpense.expenseAmount}
              onChange={(e) => setNewExpense({ ...newExpense, expenseAmount: e.target.value })}
            />
          </div>
          <button onClick={handleAddExpense}>Add Expense</button>
        </div>
      )}

      {budgets.length > 0 && (
        <div>
          <h2>Budget Overview</h2>
          <table>
            <thead>
              <tr>
                <th>Budget Name</th>
                <th>Budget Amount</th>
                <th>Spent Amount</th>
                <th>Remaining Budget</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.budget_id}>
                  <td>{budget.budget_name}</td>
                  <td>{budget.budget_amount}</td>
                  {/* Calculate spent amount based on expenses */}
                  <td>{budget.budget_amount - budget.budget_remaining}</td>
                  <td>{budget.budget_remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

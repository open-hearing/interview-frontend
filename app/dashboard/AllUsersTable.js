'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export default function AllUsersTable({ reloadToken }) {
  const [users, setUsers] = useState([]);

  async function loadAllUsers() {
    const response = await fetch(API_BASE_URL + '/api/users');
    const allUsers = await response.json();
    setUsers(allUsers);
  }

  useEffect(() => {
    loadAllUsers();
  }, [reloadToken]);

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="top-bar">
        <h2>All users</h2>
        <button type="button" className="secondary" onClick={loadAllUsers}>
          Refresh
        </button>
      </div>
      <p className="notice">Showing {users.length} user records.</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Username</th>
              <th>Password</th>
              <th>Full name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Primary family contact</th>
              <th>Family</th>
            </tr>
          </thead>
          <tbody>
            {users.map((entry, rowIndex) => (
              <tr key={rowIndex}>
                <td>{entry.user.id}</td>
                <td>{entry.user.username}</td>
                <td>{entry.user.password}</td>
                <td>{entry.user.fullName}</td>
                <td>{entry.user.emailAddress}</td>
                <td>{entry.user.phoneNumber}</td>
                <td>{entry.user.role}</td>
                <td>{entry.familyMembers[0].memberName}</td>
                <td>
                  {entry.familyMembers.map((familyMember, memberIndex) => (
                    <div key={memberIndex}>
                      {familyMember.memberName} ({familyMember.relationship})
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';

export default function AllFamilyMembersTable({ reloadToken }) {
  const [familyMembers, setFamilyMembers] = useState([]);

  async function loadAllFamilyMembers() {
    const response = await fetch(API_BASE_URL + '/api/family-members');
    const allFamilyMembers = await response.json();
    setFamilyMembers(allFamilyMembers);
  }

  useEffect(() => {
    loadAllFamilyMembers();
  }, [reloadToken]);

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="top-bar">
        <h2>All family members</h2>
        <button type="button" className="secondary" onClick={loadAllFamilyMembers}>
          Refresh
        </button>
      </div>
      <p className="notice">Showing {familyMembers.length} family member records.</p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Member name</th>
              <th>Relationship</th>
              <th>Date of birth</th>
              <th>Occupation</th>
              <th>Contact</th>
              <th>Belongs to</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {familyMembers.map((entry, rowIndex) => (
              <tr key={rowIndex}>
                <td>{entry.familyMember.id}</td>
                <td>{entry.familyMember.memberName}</td>
                <td>{entry.familyMember.relationship}</td>
                <td>{entry.familyMember.dateOfBirth}</td>
                <td>{entry.familyMember.occupation}</td>
                <td>{entry.familyMember.contactNumber}</td>
                <td>{entry.user.fullName} ({entry.user.username})</td>
                <td>{entry.familyMember.createdAt}</td>
                <td>{entry.familyMember.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

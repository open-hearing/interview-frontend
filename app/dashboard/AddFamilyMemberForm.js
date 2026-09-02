'use client';

import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';

const EMPTY_FAMILY_MEMBER = {
  memberName: '',
  relationship: 'SPOUSE',
  dateOfBirth: '',
  occupation: '',
  contactNumber: '',
};

export default function AddFamilyMemberForm({ onFamilyMembersAdded }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [familyMembers, setFamilyMembers] = useState([{ ...EMPTY_FAMILY_MEMBER }]);
  const [confirmation, setConfirmation] = useState('');

  async function loadUsers() {
    const response = await fetch(API_BASE_URL + '/api/users');
    const allUsers = await response.json();
    setUsers(allUsers);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function updateFamilyMemberField(memberIndex, fieldName, fieldValue) {
    const updatedFamilyMembers = familyMembers;
    updatedFamilyMembers[memberIndex][fieldName] = fieldValue;
    setFamilyMembers([...updatedFamilyMembers]);
  }

  function addFamilyMemberRow() {
    setFamilyMembers([...familyMembers, { ...EMPTY_FAMILY_MEMBER }]);
  }

  function removeFamilyMemberRow(memberIndex) {
    setFamilyMembers(familyMembers.filter((member, index) => index !== memberIndex));
  }

  async function handleAddFamilyMembersSubmit(submitEvent) {
    submitEvent.preventDefault();
    setConfirmation('');
    if (familyMembers.length === 1) {
      const singleMemberPayload = {
        userId: Number(selectedUserId),
        memberName: familyMembers[0].memberName,
        relationship: familyMembers[0].relationship,
        dateOfBirth: familyMembers[0].dateOfBirth,
        occupation: familyMembers[0].occupation,
        contactNumber: familyMembers[0].contactNumber,
      };
      const response = await fetch(API_BASE_URL + '/api/family-members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleMemberPayload),
      });
      const createdFamilyMember = await response.json();
      setConfirmation(
        'Added ' + createdFamilyMember.familyMember.memberName + ' (id ' +
        createdFamilyMember.familyMember.id + ') to ' + createdFamilyMember.user.fullName
      );
    } else {
      const bulkPayload = {
        userId: Number(selectedUserId),
        familyMembers: familyMembers,
      };
      const response = await fetch(API_BASE_URL + '/api/family-members/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkPayload),
      });
      const createdFamilyMembers = await response.json();
      setConfirmation(
        'Added ' + createdFamilyMembers.length + ' family members to ' +
        createdFamilyMembers[0].user.fullName
      );
    }
    setFamilyMembers([{ ...EMPTY_FAMILY_MEMBER }]);
    onFamilyMembersAdded();
  }

  return (
    <div className="card">
      <h2>Add family member</h2>
      <p className="notice">
        One row posts to <code>/api/family-members</code>; more than one posts to{' '}
        <code>/api/family-members/bulk</code>.
      </p>
      <form onSubmit={handleAddFamilyMembersSubmit}>
        <label htmlFor="owning-user">User</label>
        <select
          id="owning-user"
          value={selectedUserId}
          onChange={(changeEvent) => setSelectedUserId(changeEvent.target.value)}
        >
          <option value="">Select a user</option>
          {users.map((entry, rowIndex) => (
            <option key={rowIndex} value={entry.user.id}>
              {entry.user.fullName} ({entry.user.username})
            </option>
          ))}
        </select>

        {familyMembers.map((familyMember, memberIndex) => (
          <div className="family-row" key={memberIndex}>
            <div>
              <label>Name</label>
              <input
                value={familyMember.memberName}
                onChange={(changeEvent) =>
                  updateFamilyMemberField(memberIndex, 'memberName', changeEvent.target.value)
                }
              />
            </div>
            <div>
              <label>Relationship</label>
              <select
                value={familyMember.relationship}
                onChange={(changeEvent) =>
                  updateFamilyMemberField(memberIndex, 'relationship', changeEvent.target.value)
                }
              >
                <option value="SPOUSE">Spouse</option>
                <option value="SON">Son</option>
                <option value="DAUGHTER">Daughter</option>
                <option value="FATHER">Father</option>
                <option value="MOTHER">Mother</option>
                <option value="SIBLING">Sibling</option>
              </select>
            </div>
            <div>
              <label>Date of birth</label>
              <input
                placeholder="YYYY-MM-DD"
                value={familyMember.dateOfBirth}
                onChange={(changeEvent) =>
                  updateFamilyMemberField(memberIndex, 'dateOfBirth', changeEvent.target.value)
                }
              />
            </div>
            <div>
              <label>Occupation</label>
              <input
                value={familyMember.occupation}
                onChange={(changeEvent) =>
                  updateFamilyMemberField(memberIndex, 'occupation', changeEvent.target.value)
                }
              />
            </div>
            <div>
              <label>Contact number</label>
              <input
                value={familyMember.contactNumber}
                onChange={(changeEvent) =>
                  updateFamilyMemberField(memberIndex, 'contactNumber', changeEvent.target.value)
                }
              />
            </div>
            <div style={{ paddingTop: 26 }}>
              <button type="button" className="link" onClick={() => removeFamilyMemberRow(memberIndex)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div style={{ margin: '16px 0 24px' }}>
          <button type="button" className="secondary" onClick={addFamilyMemberRow}>
            Add another row
          </button>
        </div>
        <button type="submit">Save family members</button>
      </form>
      {confirmation ? <p className="notice" style={{ marginTop: 16 }}>{confirmation}</p> : null}
    </div>
  );
}

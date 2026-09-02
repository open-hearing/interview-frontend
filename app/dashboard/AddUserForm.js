'use client';

import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080';

const EMPTY_FAMILY_MEMBER = {
  memberName: '',
  relationship: 'SPOUSE',
  dateOfBirth: '',
  occupation: '',
  contactNumber: '',
};

export default function AddUserForm({ onUserAdded }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [familyMembers, setFamilyMembers] = useState([{ ...EMPTY_FAMILY_MEMBER }]);
  const [confirmation, setConfirmation] = useState('');

  function updateFamilyMemberField(memberIndex, fieldName, fieldValue) {
    const updatedFamilyMembers = familyMembers;
    updatedFamilyMembers[memberIndex][fieldName] = fieldValue;
    setFamilyMembers([...updatedFamilyMembers]);
  }

  function addFamilyMemberRow() {
    setFamilyMembers([...familyMembers, { ...EMPTY_FAMILY_MEMBER }]);
  }

  function removeFamilyMemberRow(memberIndex) {
    const remainingFamilyMembers = familyMembers.filter((member, index) => index !== memberIndex);
    setFamilyMembers(remainingFamilyMembers);
  }

  async function handleCreateUserSubmit(submitEvent) {
    submitEvent.preventDefault();
    setConfirmation('');
    const createUserPayload = {
      username: username,
      password: password,
      fullName: fullName,
      emailAddress: emailAddress,
      phoneNumber: phoneNumber,
      residentialAddress: residentialAddress,
      dateOfBirth: dateOfBirth,
      familyMembers: familyMembers,
    };
    const response = await fetch(API_BASE_URL + '/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createUserPayload),
    });
    const createdUser = await response.json();
    setConfirmation(
      'User ' + createdUser.user.username + ' created with id ' + createdUser.user.id +
      ' and ' + createdUser.familyMembers.length + ' family member(s). Welcome email sent.'
    );
    setUsername('');
    setPassword('');
    setFullName('');
    setEmailAddress('');
    setPhoneNumber('');
    setResidentialAddress('');
    setDateOfBirth('');
    setFamilyMembers([{ ...EMPTY_FAMILY_MEMBER }]);
    onUserAdded();
  }

  return (
    <div className="card">
      <h2>Add user</h2>
      <form onSubmit={handleCreateUserSubmit}>
        <div className="form-grid">
          <div>
            <label htmlFor="new-username">Username</label>
            <input
              id="new-username"
              value={username}
              onChange={(changeEvent) => setUsername(changeEvent.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new-password">Password</label>
            <input
              id="new-password"
              value={password}
              onChange={(changeEvent) => setPassword(changeEvent.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new-full-name">Full name</label>
            <input
              id="new-full-name"
              value={fullName}
              onChange={(changeEvent) => setFullName(changeEvent.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new-email">Email address</label>
            <input
              id="new-email"
              value={emailAddress}
              onChange={(changeEvent) => setEmailAddress(changeEvent.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new-phone">Phone number</label>
            <input
              id="new-phone"
              value={phoneNumber}
              onChange={(changeEvent) => setPhoneNumber(changeEvent.target.value)}
            />
          </div>
          <div>
            <label htmlFor="new-dob">Date of birth</label>
            <input
              id="new-dob"
              placeholder="YYYY-MM-DD"
              value={dateOfBirth}
              onChange={(changeEvent) => setDateOfBirth(changeEvent.target.value)}
            />
          </div>
        </div>
        <label htmlFor="new-address">Residential address</label>
        <input
          id="new-address"
          value={residentialAddress}
          onChange={(changeEvent) => setResidentialAddress(changeEvent.target.value)}
        />

        <h2 style={{ marginTop: 24 }}>Family details</h2>
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
            Add family member
          </button>
        </div>
        <button type="submit">Create user</button>
      </form>
      {confirmation ? <p className="notice" style={{ marginTop: 16 }}>{confirmation}</p> : null}
    </div>
  );
}

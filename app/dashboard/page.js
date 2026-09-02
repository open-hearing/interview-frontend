'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AddUserForm from './AddUserForm';
import AllUsersTable from './AllUsersTable';
import AddFamilyMemberForm from './AddFamilyMemberForm';
import AllFamilyMembersTable from './AllFamilyMembersTable';

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('users');
  const [signedInFullName, setSignedInFullName] = useState('');
  const [usersReloadToken, setUsersReloadToken] = useState(0);
  const [familyMembersReloadToken, setFamilyMembersReloadToken] = useState(0);

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      router.push('/login');
      return;
    }
    setSignedInFullName(localStorage.getItem('fullName'));
  }, [router]);

  function handleSignOut() {
    localStorage.clear();
    router.push('/login');
  }

  function handleUserAdded() {
    setUsersReloadToken(usersReloadToken + 1);
    setFamilyMembersReloadToken(familyMembersReloadToken + 1);
  }

  function handleFamilyMembersAdded() {
    setFamilyMembersReloadToken(familyMembersReloadToken + 1);
    setUsersReloadToken(usersReloadToken + 1);
  }

  return (
    <main className="page-shell">
      <div className="top-bar">
        <div>
          <h1>User Portal</h1>
          <p className="subtitle" style={{ margin: 0 }}>Signed in as {signedInFullName}</p>
        </div>
        <button type="button" className="secondary" onClick={handleSignOut}>
          Sign out
        </button>
      </div>

      <div className="tab-bar">
        <button
          type="button"
          className={activeSection === 'users' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveSection('users')}
        >
          Users
        </button>
        <button
          type="button"
          className={activeSection === 'family-members' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveSection('family-members')}
        >
          Family Members
        </button>
      </div>

      {activeSection === 'users' ? (
        <section>
          <AddUserForm onUserAdded={handleUserAdded} />
          <AllUsersTable reloadToken={usersReloadToken} />
        </section>
      ) : (
        <section>
          <AddFamilyMemberForm onFamilyMembersAdded={handleFamilyMembersAdded} />
          <AllFamilyMembersTable reloadToken={familyMembersReloadToken} />
        </section>
      )}
    </main>
  );
}

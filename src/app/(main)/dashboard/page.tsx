'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { GroupCard } from '@/components/GroupCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;

    // Listen to groups where user is a member
    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const groupsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGroups(groupsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Splitzy</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user.displayName}
                </span>
              </div>
              <Button onClick={signOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            onClick={() => router.push('/create-group')}
            variant="primary"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Group
          </Button>
          <Button
            onClick={() => router.push('/join-group')}
            variant="outline"
            size="lg"
            className="flex-1 sm:flex-none"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Join Group
          </Button>
        </div>

        {/* Groups List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Groups ({groups.length})
          </h2>

          {groups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No groups yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create a new group or join an existing one to get started
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push('/create-group')}>
                  Create Group
                </Button>
                <Button
                  onClick={() => router.push('/join-group')}
                  variant="outline"
                >
                  Join Group
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  name={group.name}
                  memberCount={group.members?.length || 0}
                  joinCode={group.joinCode}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

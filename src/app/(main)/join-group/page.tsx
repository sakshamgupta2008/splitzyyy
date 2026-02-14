'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function JoinGroupPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinCode.trim() || joinCode.length !== 5) {
      toast.error('Please enter a valid 5-digit join code');
      return;
    }

    if (!user) return;

    setIsLoading(true);

    try {
      // Find group with join code
      const groupsRef = collection(db, 'groups');
      const q = query(groupsRef, where('joinCode', '==', joinCode));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error('Group not found. Please check the join code.');
        setIsLoading(false);
        return;
      }

      const groupDoc = snapshot.docs[0];
      const groupData = groupDoc.data();

      // Check if user is already a member
      if (groupData.members.includes(user.uid)) {
        toast.error('You are already a member of this group');
        router.push(`/group?id=${groupDoc.id}`);
        return;
      }

      // Add user to group members
      await updateDoc(doc(db, 'groups', groupDoc.id), {
        members: arrayUnion(user.uid),
      });

      toast.success('Successfully joined the group!');
      router.push(`/group?id=${groupDoc.id}`);
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join a Group</h1>
          <p className="text-gray-600">
            Enter the 5-digit code shared by your friend
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                label="Join Code"
                type="text"
                placeholder="Enter 5-digit code"
                value={joinCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setJoinCode(value);
                }}
                maxLength={5}
                required
                autoFocus
                className="text-center text-2xl font-mono tracking-widest"
              />
              <p className="mt-2 text-sm text-gray-600 text-center">
                Ask your friend for the join code from their group
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">How to find the join code?</p>
                  <p>
                    The person who created the group can find the 5-digit join
                    code on the group page. They can share it with you to join.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={joinCode.length !== 5}
                className="flex-1"
              >
                Join Group
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

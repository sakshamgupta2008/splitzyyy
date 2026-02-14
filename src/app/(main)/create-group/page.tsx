'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { generateUniqueJoinCode } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CreateGroupPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (!user) return;

    setIsLoading(true);

    try {
      // Generate unique join code
      const joinCode = await generateUniqueJoinCode();

      // Create group
      const groupRef = await addDoc(collection(db, 'groups'), {
        name: groupName.trim(),
        joinCode,
        createdBy: user.uid,
        members: [user.uid],
        createdAt: new Date(),
      });

      toast.success('Group created successfully!');
      router.push(`/group?id=${groupRef.id}`);
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || 'Failed to create group');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create a New Group
          </h1>
          <p className="text-gray-600">
            Start tracking expenses with your friends
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Group Name"
              placeholder="e.g., Goa Trip 2026"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              autoFocus
            />

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5"
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
                <div className="text-sm text-primary-800">
                  <p className="font-medium mb-1">What happens next?</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>A unique 5-digit join code will be generated</li>
                    <li>Share this code with friends to join the group</li>
                    <li>You'll be the first member of the group</li>
                  </ul>
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
                className="flex-1"
              >
                Create Group
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

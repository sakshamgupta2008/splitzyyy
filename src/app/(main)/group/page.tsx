'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useGroupData } from '@/hooks/useGroupData';
import {
    calculateUserBalance,
    calculateGroupBalances,
    formatCurrency,
} from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ExpenseList } from '@/components/ExpenseList';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import toast from 'react-hot-toast';

function GroupContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const groupId = searchParams.get('id');

    const { group, members, expenses, transactions, loading } = useGroupData(groupId || '');
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!groupId) {
            // logic to handle missing id, maybe redirect or just wait
            return;
        }
        if (!loading && group && user) {
            // Check if user is a member
            if (group.members && !group.members.includes(user.uid)) {
                toast.error('You are not a member of this group');
                router.push('/dashboard');
            }
        }
    }, [group, user, loading, router, groupId]);

    const handleCopyJoinCode = () => {
        if (group?.joinCode) {
            navigator.clipboard.writeText(group.joinCode);
            setCopiedCode(true);
            toast.success('Join code copied to clipboard!');
            setTimeout(() => setCopiedCode(false), 2000);
        }
    };

    if (authLoading || loading) {
        return <LoadingSpinner />;
    }

    if (!groupId) {
        return null; // Or redirect
    }

    if (!user || !group) {
        return null;
    }

    // Calculate balances
    const userBalance = calculateUserBalance(user.uid, expenses, transactions);
    const groupBalances = calculateGroupBalances(members, expenses, transactions);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="flex items-center text-primary-600 hover:text-primary-700"
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
                            Back
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Balances & Members */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Join Code Card */}
                        <Card className="p-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Group Join Code
                            </h3>
                            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                                <span className="text-2xl font-mono font-bold text-gray-900">
                                    {group.joinCode}
                                </span>
                                <Button
                                    onClick={handleCopyJoinCode}
                                    variant="outline"
                                    size="sm"
                                >
                                    {copiedCode ? (
                                        <>
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-4 h-4 mr-1"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Share this code with friends to invite them
                            </p>
                        </Card>

                        {/* Your Balance */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Your Balance
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Total Paid</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(userBalance.totalPaid)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Your Share</span>
                                    <span className="font-semibold text-gray-900">
                                        {formatCurrency(userBalance.personalTripCost)}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">You Owe</span>
                                        <span className="font-semibold text-red-600">
                                            {formatCurrency(userBalance.youOwe)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Others Owe You</span>
                                    <span className="font-semibold text-green-600">
                                        {formatCurrency(userBalance.othersOweYou)}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">Net Balance</span>
                                        <span
                                            className={`text-xl font-bold ${userBalance.netBalance > 0
                                                    ? 'text-green-600'
                                                    : userBalance.netBalance < 0
                                                        ? 'text-red-600'
                                                        : 'text-gray-900'
                                                }`}
                                        >
                                            {formatCurrency(Math.abs(userBalance.netBalance))}
                                        </span>
                                    </div>
                                    {userBalance.netBalance !== 0 && (
                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                            {userBalance.netBalance > 0
                                                ? 'You are owed'
                                                : 'You owe'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Members */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Members ({members.length})
                            </h3>
                            <div className="space-y-3">
                                {groupBalances.map((balance) => (
                                    <div
                                        key={balance.userId}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            {balance.userPhoto && (
                                                <img
                                                    src={balance.userPhoto}
                                                    alt={balance.userName}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {balance.userName}
                                                    {balance.userId === user.uid && (
                                                        <span className="text-xs text-gray-500 ml-2">
                                                            (You)
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Paid: {formatCurrency(balance.totalPaid)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`font-semibold ${balance.netBalance > 0
                                                        ? 'text-green-600'
                                                        : balance.netBalance < 0
                                                            ? 'text-red-600'
                                                            : 'text-gray-900'
                                                    }`}
                                            >
                                                {balance.netBalance > 0 ? '+' : ''}
                                                {formatCurrency(balance.netBalance)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Expenses */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
                            <Button
                                onClick={() => setIsAddExpenseOpen(true)}
                                variant="primary"
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
                                Add Expense
                            </Button>
                        </div>

                        <ExpenseList
                            expenses={expenses}
                            members={members}
                            currentUserId={user.uid}
                        />
                    </div>
                </div>
            </main>

            {/* Add Expense Modal */}
            <AddExpenseModal
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
                groupId={groupId}
                members={members}
                currentUserId={user.uid}
            />
        </div>
    );
}

export default function GroupPage() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <GroupContent />
        </Suspense>
    );
}

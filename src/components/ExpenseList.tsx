'use client';

import React from 'react';
import { Expense } from '@/lib/utils';
import { formatCurrency, formatDate, getUserName } from '@/lib/utils';
import { Card } from './ui/Card';

interface ExpenseListProps {
  expenses: Expense[];
  members: any[];
  currentUserId: string;
}

export function ExpenseList({ expenses, members, currentUserId }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 text-lg">No expenses yet</p>
        <p className="text-gray-500 text-sm mt-2">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const paidByName = getUserName(expense.paidBy, members);
        const isPaidByCurrentUser = expense.paidBy === currentUserId;
        const isInvolved = expense.splitAmong.includes(currentUserId);

        return (
          <Card key={expense.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-lg mb-1">
                  {expense.description}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span>
                    Paid by{' '}
                    <span className="font-medium">
                      {isPaidByCurrentUser ? 'You' : paidByName}
                    </span>
                  </span>
                  <span>•</span>
                  <span>{expense.splitAmong.length} people</span>
                  <span>•</span>
                  <span>{formatDate(expense.createdAt)}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(expense.totalAmount)}
                </div>
                {isInvolved && (
                  <div className="text-sm text-gray-600 mt-1">
                    Your share: {formatCurrency(expense.perPersonAmount)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Split details */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs text-gray-500 mb-2">Split among:</div>
              <div className="flex flex-wrap gap-2">
                {expense.splitAmong.map((userId) => {
                  const userName = getUserName(userId, members);
                  const isCurrentUser = userId === currentUserId;
                  return (
                    <span
                      key={userId}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCurrentUser
                          ? 'bg-primary-100 text-primary-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {isCurrentUser ? 'You' : userName}
                    </span>
                  );
                })}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

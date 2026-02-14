'use client';

import React, { useState } from 'react';
import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import toast from 'react-hot-toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  members: any[];
  currentUserId: string;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  groupId,
  members,
  currentUserId,
}: AddExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [splitAmong, setSplitAmong] = useState<string[]>([currentUserId]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleMember = (memberId: string) => {
    if (splitAmong.includes(memberId)) {
      // Don't allow removing if only one person selected
      if (splitAmong.length > 1) {
        setSplitAmong(splitAmong.filter((id) => id !== memberId));
      }
    } else {
      setSplitAmong([...splitAmong, memberId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (splitAmong.length === 0) {
      toast.error('Please select at least one person to split with');
      return;
    }

    setIsLoading(true);

    try {
      const perPersonAmount = amount / splitAmong.length;

      // Create expense
      const expenseRef = await addDoc(
        collection(db, 'groups', groupId, 'expenses'),
        {
          description: description.trim(),
          totalAmount: amount,
          paidBy,
          splitAmong,
          perPersonAmount,
          createdAt: new Date(),
        }
      );

      // Create transactions using batch
      const batch = writeBatch(db);

      splitAmong.forEach((memberId) => {
        if (memberId !== paidBy) {
          const transactionRef = doc(
            collection(db, 'groups', groupId, 'transactions')
          );
          batch.set(transactionRef, {
            from: memberId,
            to: paidBy,
            amount: perPersonAmount,
            expenseId: expenseRef.id,
            createdAt: new Date(),
          });
        }
      });

      await batch.commit();

      toast.success('Expense added successfully!');
      
      // Reset form
      setDescription('');
      setTotalAmount('');
      setPaidBy(currentUserId);
      setSplitAmong([currentUserId]);
      
      onClose();
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast.error(error.message || 'Failed to add expense');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Description"
          placeholder="e.g., Dinner at restaurant"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <Input
          label="Total Amount (₹)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paid by
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          >
            {members.map((member) => (
              <option key={member.uid} value={member.uid}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Split among ({splitAmong.length} selected)
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
            {members.map((member) => (
              <label
                key={member.uid}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={splitAmong.includes(member.uid)}
                  onChange={() => handleToggleMember(member.uid)}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex items-center gap-2">
                  {member.photoURL && (
                    <img
                      src={member.photoURL}
                      alt={member.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {member.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
          {splitAmong.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Each person pays: ₹
              {totalAmount ? (parseFloat(totalAmount) / splitAmong.length).toFixed(2) : '0.00'}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1">
            Add Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}

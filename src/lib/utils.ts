import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  expenseId: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string;
  splitAmong: string[];
  perPersonAmount: number;
  createdAt: Date;
}

export interface BalanceSummary {
  totalPaid: number;
  personalTripCost: number;
  youOwe: number;
  othersOweYou: number;
  netBalance: number;
}

export interface UserBalance {
  userId: string;
  userName: string;
  userPhoto: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

/**
 * Calculate balance summary for a specific user
 */
export function calculateUserBalance(
  userId: string,
  expenses: Expense[],
  transactions: Transaction[]
): BalanceSummary {
  // Total amount paid by user
  const totalPaid = expenses
    .filter((exp) => exp.paidBy === userId)
    .reduce((sum, exp) => sum + exp.totalAmount, 0);

  // Personal trip cost (user's share of all expenses they're part of)
  const personalTripCost = expenses
    .filter((exp) => exp.splitAmong.includes(userId))
    .reduce((sum, exp) => sum + exp.perPersonAmount, 0);

  // Amount user owes to others
  const youOwe = transactions
    .filter((txn) => txn.from === userId)
    .reduce((sum, txn) => sum + txn.amount, 0);

  // Amount others owe to user
  const othersOweYou = transactions
    .filter((txn) => txn.to === userId)
    .reduce((sum, txn) => sum + txn.amount, 0);

  // Net balance
  const netBalance = othersOweYou - youOwe;

  return {
    totalPaid,
    personalTripCost,
    youOwe,
    othersOweYou,
    netBalance,
  };
}

/**
 * Calculate balance for all members in a group
 */
export function calculateGroupBalances(
  members: any[],
  expenses: Expense[],
  transactions: Transaction[]
): UserBalance[] {
  return members.map((member) => {
    const totalPaid = expenses
      .filter((exp) => exp.paidBy === member.uid)
      .reduce((sum, exp) => sum + exp.totalAmount, 0);

    const totalOwed = expenses
      .filter((exp) => exp.splitAmong.includes(member.uid))
      .reduce((sum, exp) => sum + exp.perPersonAmount, 0);

    const netBalance = totalPaid - totalOwed;

    return {
      userId: member.uid,
      userName: member.name,
      userPhoto: member.photoURL,
      totalPaid,
      totalOwed,
      netBalance,
    };
  });
}

/**
 * Generate a unique 5-digit join code
 */
export function generateJoinCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * Check if join code already exists
 */
export async function isJoinCodeUnique(joinCode: string): Promise<boolean> {
  const groupsRef = collection(db, 'groups');
  const q = query(groupsRef, where('joinCode', '==', joinCode));
  const snapshot = await getDocs(q);
  return snapshot.empty;
}

/**
 * Generate a unique join code that doesn't exist in database
 */
export async function generateUniqueJoinCode(): Promise<string> {
  let joinCode = generateJoinCode();
  let isUnique = await isJoinCodeUnique(joinCode);

  while (!isUnique) {
    joinCode = generateJoinCode();
    isUnique = await isJoinCodeUnique(joinCode);
  }

  return joinCode;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

/**
 * Format date
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get user name from members list
 */
export function getUserName(userId: string, members: any[]): string {
  const member = members.find((m) => m.uid === userId);
  return member?.name || 'Unknown';
}

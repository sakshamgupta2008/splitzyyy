'use client';

import { useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Expense, Transaction } from '@/lib/utils';

export function useGroupData(groupId: string) {
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    const loadGroupAndMembers = async () => {
      try {
        // Get group data
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        if (groupDoc.exists()) {
          const groupData = { id: groupDoc.id, ...groupDoc.data() } as any;
          setGroup(groupData);

          // Get member details
          const memberPromises = groupData.members.map(async (uid: string) => {
            const userDoc = await getDoc(doc(db, 'users', uid));
            return userDoc.exists() ? { uid, ...userDoc.data() } : null;
          });

          const membersData = await Promise.all(memberPromises);
          setMembers(membersData.filter(Boolean));
        }
      } catch (error) {
        console.error('Error loading group:', error);
      }
    };

    loadGroupAndMembers();

    // Listen to expenses
    const expensesQuery = query(
      collection(db, 'groups', groupId, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeExpenses = onSnapshot(expensesQuery, (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Expense[];
      setExpenses(expensesData);
      setLoading(false);
    });

    // Listen to transactions
    const transactionsQuery = query(
      collection(db, 'groups', groupId, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Transaction[];
      setTransactions(transactionsData);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeTransactions();
    };
  }, [groupId]);

  return { group, members, expenses, transactions, loading };
}

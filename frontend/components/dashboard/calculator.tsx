'use client';
import React, { useState } from 'react';
import { Calculator, Save, RefreshCcw } from 'lucide-react';
import CustomModal from '../CustomModal';

interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
}

interface Budget {
  totalBudget: number;
  expenses: Expense[];
}

const initialCategories = [
  'Transportation',
  'Accommodation',
  'Food & Dining',
  'Activities',
  'Shopping',
  'Insurance',
  'Miscellaneous'
];

const TravelBudgetCalculator = () => {
  const [budget, setBudget] = useState<Budget>({
    totalBudget: 0,
    expenses: []
  });
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    category: initialCategories[0],
    amount: 0,
    note: ''
  });

  const handleAddExpense = () => {
    if (newExpense.amount <= 0) return;
    
    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString()
    };
    
    setBudget(prev => ({
      ...prev,
      expenses: [...prev.expenses, expense]
    }));
    
    setNewExpense({
      category: initialCategories[0],
      amount: 0,
      note: ''
    });
  };

  const handleDeleteExpense = (id: string) => {
    setBudget(prev => ({
      ...prev,
      expenses: prev.expenses.filter(expense => expense.id !== id)
    }));
  };

  const handleReset = () => {
    setBudget({
      totalBudget: 0,
      expenses: []
    });
    setNewExpense({
      category: initialCategories[0],
      amount: 0,
      note: ''
    });
  };

  const totalExpenses = budget.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget.totalBudget - totalExpenses;
  
  // Calculate category totals
  const categoryTotals = budget.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
  

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
            <Calculator className="w-8 h-8 mr-2 text-blue-500" />
            Travel Budget Calculator
          </h1>
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            <RefreshCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>

        {/* Total Budget Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Budget
          </label>
          <input
            type="number"
            value={budget.totalBudget}
            onChange={(e) => setBudget(prev => ({ ...prev, totalBudget: Number(e.target.value) }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your total budget"
          />
        </div>

        {/* Add New Expense Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
            >
              {initialCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Amount"
            />
          </div>
          <div className="md:col-span-1">
            <input
              type="text"
              value={newExpense.note}
              onChange={(e) => setNewExpense(prev => ({ ...prev, note: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Note"
            />
          </div>
          <div>
            <button
              onClick={handleAddExpense}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-1" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
            <p className="text-2xl font-bold text-gray-900">${budget.totalBudget}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Total Expenses</h3>
            <p className="text-2xl font-bold text-rose-600">${totalExpenses}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Remaining</h3>
            <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${remainingBudget}
            </p>
          </div>
        </div>

        {/* Expense List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          <div className="space-y-2">
            {budget.expenses.map(expense => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{expense.category}</p>
                  {expense.note && <p className="text-sm text-gray-500">{expense.note}</p>}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">${expense.amount}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Summary */}
        {Object.keys(categoryTotals).length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Category Totals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryTotals).map(([category, total]) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">{category}</h3>
                  <p className="text-xl font-bold text-gray-900">${total}</p>
                  <p className="text-sm text-gray-500">
                    {((total / totalExpenses) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
     
    </div>
  );
};

export default TravelBudgetCalculator;
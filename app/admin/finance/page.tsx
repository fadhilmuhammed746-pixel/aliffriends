'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  FinanceTransaction,
  FinanceSummary,
  FinanceAuditLog,
  TransactionType,
  IncomeCategory,
  ExpenseCategory,
} from '@/lib/types';
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Download,
  Printer,
  Search,
  Filter,
  History,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  RefreshCw,
  Paperclip,
} from 'lucide-react';

const INCOME_CATEGORIES: IncomeCategory[] = [
  'Member Contributions',
  'Donations',
  'Event Collections',
  'Magazine Sales',
  'Other Income',
];

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Program Expenses',
  'Printing',
  'Magazine Production',
  'Travel',
  'Food',
  'Decorations',
  'Equipment',
  'Other Expenses',
];

export default function AdminFinancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<FinanceAuditLog[]>([]);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Modals state
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [viewTransaction, setViewTransaction] = useState<FinanceTransaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<FinanceTransaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState<string>('');
  const [formCounterparty, setFormCounterparty] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formReceiptUrl, setFormReceiptUrl] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [confirmNegativeBalance, setConfirmNegativeBalance] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/finance');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        setTransactions(data.transactions);
        setAuditLogs(data.auditLogs);
      }
    } catch (err) {
      console.error('Failed to load finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const resetForm = () => {
    setFormAmount('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('');
    setFormCounterparty('');
    setFormDescription('');
    setFormReceiptUrl('');
    setFormNotes('');
    setConfirmNegativeBalance(false);
    setEditingTransaction(null);
  };

  const handleOpenAddIncome = () => {
    resetForm();
    setFormCategory('Member Contributions');
    setIncomeModalOpen(true);
  };

  const handleOpenAddExpense = () => {
    resetForm();
    setFormCategory('Program Expenses');
    setExpenseModalOpen(true);
  };

  const handleOpenEdit = (tx: FinanceTransaction) => {
    setEditingTransaction(tx);
    setFormAmount(String(tx.amount));
    setFormDate(tx.date);
    setFormCategory(tx.category);
    setFormCounterparty(tx.counterparty);
    setFormDescription(tx.description);
    setFormReceiptUrl(tx.receiptUrl || '');
    setFormNotes(tx.notes || '');

    if (tx.type === 'income') {
      setIncomeModalOpen(true);
    } else {
      setExpenseModalOpen(true);
    }
  };

  const handleSubmitTransaction = async (type: 'income' | 'expense') => {
    const numAmount = Number(formAmount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    if (!formCategory) {
      alert('Please select a category.');
      return;
    }

    if (!formCounterparty.trim()) {
      alert(type === 'income' ? 'Please enter who payment was received from.' : 'Please enter who payment was paid to.');
      return;
    }

    if (!formDescription.trim()) {
      alert('Please provide a description for this transaction.');
      return;
    }

    // Negative balance check for expenses
    if (type === 'expense' && summary && !editingTransaction) {
      if (summary.currentBalance - numAmount < 0 && !confirmNegativeBalance) {
        alert('Warning: This expense exceeds current treasury balance. Please check the confirmation box to proceed.');
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        type,
        category: formCategory,
        amount: numAmount,
        date: formDate,
        counterparty: formCounterparty.trim(),
        description: formDescription.trim(),
        receiptUrl: formReceiptUrl.trim() || undefined,
        notes: formNotes.trim() || undefined,
      };

      if (editingTransaction) {
        const res = await fetch(`/api/finance/${editingTransaction.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update transaction');
      } else {
        const res = await fetch('/api/finance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to record transaction');
      }

      setIncomeModalOpen(false);
      setExpenseModalOpen(false);
      resetForm();
      await fetchFinanceData();
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to permanently delete transaction ${id}? Running balances of all subsequent transactions will be automatically recalculated.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/finance/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete transaction');
      setDeletingId(null);
      await fetchFinanceData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  // Filter & Search logic
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.counterparty.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [transactions, typeFilter, categoryFilter, search, sortOrder]);

  // Category expense breakdown
  const expenseBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    let total = 0;
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        map[t.category] = (map[t.category] || 0) + t.amount;
        total += t.amount;
      }
    });

    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? ((amount / total) * 100).toFixed(1) : '0',
    }));
  }, [transactions]);

  const handlePrint = () => {
    window.print();
  };

  const formatINR = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex w-full min-h-screen bg-canvas">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto max-h-screen text-ink print:overflow-visible print:max-h-none print:w-full">
        {/* Header (Hidden in Print) */}
        <div className="print:hidden">
          <AdminHeader
            title="Class Treasury & Finance Management"
            subtitle="Private class accounting ledger, cash-flow balances, receipts, and audit trail."
            action={
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenAddIncome}
                  className="px-3.5 py-2 bg-forest hover:bg-forest-800 text-white text-xs font-serif font-bold uppercase tracking-wider rounded-xl shadow-subtle flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Income</span>
                </button>
                <button
                  onClick={handleOpenAddExpense}
                  className="px-3.5 py-2 bg-coral hover:bg-coral-dark text-white text-xs font-serif font-bold uppercase tracking-wider rounded-xl shadow-subtle flex items-center gap-1.5 transition-all"
                >
                  <Minus className="w-3.5 h-3.5" />
                  <span>Add Expense</span>
                </button>
                <a
                  href="/api/finance/export"
                  download
                  className="px-3 py-2 bg-white hover:bg-canvas-subtle border border-editorial-border text-forest text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  title="Export Financial Ledger to CSV"
                >
                  <Download className="w-3.5 h-3.5 text-forest" />
                  <span>CSV</span>
                </a>
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 bg-white hover:bg-canvas-subtle border border-editorial-border text-forest text-xs font-sans font-semibold uppercase tracking-wider rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
                  title="Print Official Ledger Statement"
                >
                  <Printer className="w-3.5 h-3.5 text-forest" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setAuditModalOpen(true)}
                  className="p-2 bg-white hover:bg-canvas-subtle border border-editorial-border text-muted hover:text-forest rounded-lg shadow-sm transition-all"
                  title="Audit Trail Logs"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>
            }
          />
        </div>

        {/* Printable Statement Banner (Only visible when printing) */}
        <div className="hidden print:block p-8 border-b-2 border-forest mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold text-forest">ALIF FRIENDS 12</h1>
              <p className="font-serif italic text-sm text-muted">A Class. A Generation. A Thousand Memories.</p>
              <h2 className="text-xl font-bold text-ink mt-3">OFFICIAL CLASS TREASURY STATEMENT</h2>
              <p className="text-xs font-mono text-muted">Generated On: {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase font-mono text-muted">Current Ledger Balance</div>
              <div className="font-serif text-3xl font-bold text-forest">
                {summary ? formatINR(summary.currentBalance) : '₹0'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
          {/* Security Notice Pill */}
          <div className="print:hidden p-3.5 rounded-xl bg-white border border-editorial-border flex items-center justify-between shadow-editorial">
            <div className="flex items-center gap-2.5 text-xs text-muted">
              <ShieldCheck className="w-4 h-4 text-forest flex-shrink-0" />
              <span>
                <strong className="text-ink">Private Financial Ledger:</strong> Authorized for class administrators only. Figures are strictly hidden from public visitors.
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-forest bg-forest/10 px-2 py-0.5 rounded">
              Currency: INR (₹)
            </span>
          </div>

          {/* Top 4 Key Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Current Balance */}
            <div className="bg-white border-2 border-forest/30 rounded-2xl p-5 shadow-editorial relative overflow-hidden group hover:border-forest transition-colors">
              <div className="absolute top-0 right-0 w-24 h-24 bg-forest/5 rounded-bl-full pointer-events-none" />
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-muted font-bold">
                  Current Balance
                </span>
                <span className="p-2 rounded-xl bg-forest/10 text-forest">
                  <IndianRupee className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-forest tracking-tight">
                {summary ? formatINR(summary.currentBalance) : '₹1,100'}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-muted">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Live treasury reserve</span>
              </div>
            </div>

            {/* 2. Opening Balance */}
            <div className="bg-white border border-editorial-border rounded-2xl p-5 shadow-editorial hover:shadow-editorial-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-muted font-bold">
                  Opening Balance
                </span>
                <span className="p-2 rounded-xl bg-canvas text-forest">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-ink tracking-tight">
                {summary ? formatINR(summary.openingBalance) : '₹1,100'}
              </div>
              <div className="mt-2 text-xs font-mono text-muted">
                Initial fund setup on {summary?.setupDate ? new Date(summary.setupDate).toLocaleDateString('en-IN') : 'Setup'}
              </div>
            </div>

            {/* 3. Total Income */}
            <div className="bg-white border border-editorial-border rounded-2xl p-5 shadow-editorial hover:shadow-editorial-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-muted font-bold">
                  Total Income
                </span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-emerald-800 tracking-tight">
                {summary ? formatINR(summary.totalIncome) : '₹0'}
              </div>
              <div className="mt-2 text-xs font-mono text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Since initial setup</span>
              </div>
            </div>

            {/* 4. Total Expenses */}
            <div className="bg-white border border-editorial-border rounded-2xl p-5 shadow-editorial hover:shadow-editorial-lg transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase font-mono tracking-wider text-muted font-bold">
                  Total Expenses
                </span>
                <span className="p-2 rounded-xl bg-coral/10 text-coral">
                  <TrendingDown className="w-4 h-4" />
                </span>
              </div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-coral tracking-tight">
                {summary ? formatINR(summary.totalExpenses) : '₹0'}
              </div>
              <div className="mt-2 text-xs font-mono text-coral flex items-center gap-1">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>Approved disbursements</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Expense Summary */}
            <div className="lg:col-span-2 bg-white border border-editorial-border rounded-2xl p-6 shadow-editorial">
              <div className="flex items-center justify-between mb-4 border-b border-editorial-border pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-forest">Expense Categories & Allocation</h3>
                  <p className="text-xs text-muted">Distribution of class expenditures by category.</p>
                </div>
                <span className="text-xs font-mono font-semibold text-coral bg-coral/10 px-2.5 py-1 rounded">
                  {expenseBreakdown.length} Categories Used
                </span>
              </div>

              {expenseBreakdown.length === 0 ? (
                <div className="py-10 text-center text-muted font-serif italic text-sm">
                  No expenses recorded yet. Total disbursements stand at ₹0.
                </div>
              ) : (
                <div className="space-y-4">
                  {expenseBreakdown.map((item) => (
                    <div key={item.category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="font-semibold text-ink">{item.category}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-coral font-bold">{formatINR(item.amount)}</span>
                          <span className="text-muted text-[11px]">({item.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-canvas rounded-full overflow-hidden">
                        <div
                          className="h-full bg-coral rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Treasury Reserve Ratio & Setup Info */}
            <div className="bg-white border border-editorial-border rounded-2xl p-6 shadow-editorial flex flex-col justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-forest mb-1">Treasury Health</h3>
                <p className="text-xs text-muted mb-4">Liquidity ratio & audit verification status.</p>

                <div className="p-4 rounded-xl bg-canvas border border-editorial-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Net Cash Flow:</span>
                    <span className={`font-mono font-bold ${
                      (summary?.totalIncome || 0) >= (summary?.totalExpenses || 0)
                        ? 'text-emerald-700'
                        : 'text-coral'
                    }`}>
                      {summary && (summary.totalIncome - summary.totalExpenses >= 0 ? '+' : '')}
                      {summary ? formatINR(summary.totalIncome - summary.totalExpenses) : '₹0'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Total Recorded Transactions:</span>
                    <span className="font-mono font-bold text-ink">
                      {transactions.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">Audit Trail Status:</span>
                    <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-editorial-border text-center">
                <button
                  onClick={() => setAuditModalOpen(true)}
                  className="w-full py-2 px-3 bg-canvas hover:bg-canvas-subtle border border-editorial-border rounded-xl text-xs font-sans font-semibold text-forest flex items-center justify-center gap-1.5 transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>View All Audit Trail Logs</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transaction Ledger Table with Search & Filters */}
          <div className="bg-white border border-editorial-border rounded-2xl p-6 shadow-editorial space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-editorial-border">
              <div>
                <h3 className="font-serif font-bold text-xl text-forest">Transaction Ledger</h3>
                <p className="text-xs text-muted">Complete chronologically reconciled cash transactions.</p>
              </div>

              <div className="text-xs font-mono text-muted">
                Showing {filteredTransactions.length} of {transactions.length} entries
              </div>
            </div>

            {/* Filter controls */}
            <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search description, recipient, ID..."
                  className="w-full pl-9 pr-3 py-2 bg-canvas border border-editorial-border rounded-lg text-xs text-ink placeholder-muted focus:outline-none focus:border-forest"
                />
              </div>

              {/* Type Filter */}
              <div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-canvas border border-editorial-border rounded-lg text-xs text-ink focus:outline-none focus:border-forest font-sans"
                >
                  <option value="all">All Types (Income & Expense)</option>
                  <option value="income">Income Only (+)</option>
                  <option value="expense">Expense Only (-)</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-canvas border border-editorial-border rounded-lg text-xs text-ink focus:outline-none focus:border-forest font-sans"
                >
                  <option value="all">All Categories</option>
                  <optgroup label="Income Categories">
                    {INCOME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Expense Categories">
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="w-full px-3 py-2 bg-canvas border border-editorial-border rounded-lg text-xs text-ink focus:outline-none focus:border-forest font-sans"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="oldest">Sort: Oldest First</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="text-center py-12 text-muted font-serif italic text-sm">
                Loading ledger records...
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-16 bg-canvas/40 border border-dashed border-editorial-border rounded-xl p-8">
                <IndianRupee className="w-10 h-10 text-muted mx-auto mb-3" />
                <p className="font-serif text-lg text-ink font-semibold">No transactions found</p>
                <p className="text-xs text-muted mt-1 mb-4">
                  {transactions.length === 0
                    ? 'The class treasury currently has its opening balance of ₹1,100 with zero recorded transactions.'
                    : 'No transactions match the selected search or filter criteria.'}
                </p>
                {transactions.length === 0 && (
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleOpenAddIncome}
                      className="px-4 py-2 bg-emerald-700 text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
                    >
                      Record First Income
                    </button>
                    <button
                      onClick={handleOpenAddExpense}
                      className="px-4 py-2 bg-coral text-white text-xs uppercase font-sans font-semibold tracking-wider rounded-lg"
                    >
                      Record First Expense
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-editorial-border text-[10px] uppercase font-mono tracking-wider text-muted bg-canvas/60">
                      <th className="py-3 px-3">Txn ID</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Description & Party</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-3 text-right">Balance After</th>
                      <th className="py-3 px-3 print:hidden text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-editorial-border">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-canvas/50 transition-colors">
                        <td className="py-3.5 px-3 font-mono text-[11px] font-semibold text-forest">
                          {t.id}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-muted whitespace-nowrap">
                          {t.date}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              t.type === 'income'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-coral/15 text-coral border border-coral/30'
                            }`}
                          >
                            {t.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {t.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-medium text-ink">
                          {t.category}
                        </td>
                        <td className="py-3.5 px-3 max-w-xs">
                          <div className="font-semibold text-ink truncate">{t.description}</div>
                          <div className="text-[11px] text-muted truncate">
                            {t.type === 'income' ? 'From: ' : 'Paid to: '}
                            <span className="font-medium text-ink/80">{t.counterparty}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-sm whitespace-nowrap">
                          <span className={t.type === 'income' ? 'text-emerald-700' : 'text-coral'}>
                            {t.type === 'income' ? '+' : '-'}
                            {formatINR(t.amount)}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-forest whitespace-nowrap">
                          {formatINR(t.balanceAfter)}
                        </td>
                        <td className="py-3.5 px-3 print:hidden text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setViewTransaction(t)}
                              className="p-1.5 text-muted hover:text-forest hover:bg-canvas rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(t)}
                              className="p-1.5 text-muted hover:text-forest hover:bg-canvas rounded transition-colors"
                              title="Edit Transaction"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
                              className="p-1.5 text-muted hover:text-coral hover:bg-coral/10 rounded transition-colors"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            MODAL 1: ADD / EDIT INCOME MODAL
           ========================================================================= */}
        {incomeModalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-forest">
                      {editingTransaction ? 'Edit Income Transaction' : 'Record Treasury Income'}
                    </h3>
                    <p className="text-xs text-muted">Credits the class fund & increases current balance.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIncomeModalOpen(false)}
                  className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitTransaction('income');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Amount (INR ₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-forest">₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full pl-8 pr-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Income Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  >
                    {INCOME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Received From *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCounterparty}
                    onChange={(e) => setFormCounterparty(e.target.value)}
                    placeholder="e.g. Class Members, Donor Name, Ticket Counter"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Description / Purpose *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="e.g. Collection for Annual Magazine Print Run"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-forest font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Receipt / Document Attachment URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formReceiptUrl}
                    onChange={(e) => setFormReceiptUrl(e.target.value)}
                    placeholder="https://... or /uploads/receipt-..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Bank reference number, mode of payment (UPI/Cash/NEFT)..."
                    className="w-full px-3.5 py-2 bg-canvas border border-editorial-border rounded-lg text-xs text-ink focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="pt-4 border-t border-editorial-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIncomeModalOpen(false)}
                    className="px-4 py-2 bg-canvas hover:bg-canvas-subtle text-xs text-muted hover:text-ink rounded-lg border border-editorial-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-sans font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
                  >
                    {submitting ? 'Recording...' : editingTransaction ? 'Update Income' : 'Save Income'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 2: ADD / EDIT EXPENSE MODAL
           ========================================================================= */}
        {expenseModalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-coral/15 text-coral">
                    <TrendingDown className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-coral">
                      {editingTransaction ? 'Edit Expense Transaction' : 'Record Treasury Expense'}
                    </h3>
                    <p className="text-xs text-muted">Debits the class fund & reduces current balance.</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpenseModalOpen(false)}
                  className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitTransaction('expense');
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Amount (INR ₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif font-bold text-coral">₹</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        required
                        value={formAmount}
                        onChange={(e) => setFormAmount(e.target.value)}
                        placeholder="e.g. 2500"
                        className="w-full pl-8 pr-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-coral font-mono font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-coral font-mono"
                    />
                  </div>
                </div>

                {/* Overdraft Warning Banner */}
                {summary && Number(formAmount) > summary.currentBalance && (
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs text-amber-900">
                    <div className="flex items-center gap-2 font-semibold">
                      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      <span>Overdraft Notice</span>
                    </div>
                    <p>
                      This expense (₹{Number(formAmount).toLocaleString('en-IN')}) exceeds the current balance ({formatINR(summary.currentBalance)}).
                      Resulting balance will be negative ({formatINR(summary.currentBalance - Number(formAmount))}).
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer font-medium pt-1">
                      <input
                        type="checkbox"
                        checked={confirmNegativeBalance}
                        onChange={(e) => setConfirmNegativeBalance(e.target.checked)}
                        className="accent-coral w-4 h-4 rounded"
                      />
                      <span>I confirm this expense may result in a negative balance</span>
                    </label>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Expense Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-coral font-sans"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Paid To *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCounterparty}
                    onChange={(e) => setFormCounterparty(e.target.value)}
                    placeholder="e.g. Printing Press Vendor, Venue Catering, Transport Agency"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-coral font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Description / Purpose *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="e.g. Advance deposit for auditorium stage lighting"
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-sm text-ink focus:outline-none focus:border-coral font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Invoice / Receipt Attachment URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={formReceiptUrl}
                    onChange={(e) => setFormReceiptUrl(e.target.value)}
                    placeholder="https://... or /uploads/invoice-..."
                    className="w-full px-3.5 py-2.5 bg-canvas border border-editorial-border rounded-lg text-xs text-ink font-mono focus:outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase font-sans font-bold tracking-wider text-muted mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Voucher reference, tax invoice number, approved by..."
                    className="w-full px-3.5 py-2 bg-canvas border border-editorial-border rounded-lg text-xs text-ink focus:outline-none focus:border-coral"
                  />
                </div>

                <div className="pt-4 border-t border-editorial-border flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setExpenseModalOpen(false)}
                    className="px-4 py-2 bg-canvas hover:bg-canvas-subtle text-xs text-muted hover:text-ink rounded-lg border border-editorial-border transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-coral hover:bg-coral-dark text-white font-sans font-semibold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all"
                  >
                    {submitting ? 'Recording...' : editingTransaction ? 'Update Expense' : 'Save Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 3: VIEW TRANSACTION DETAILS MODAL
           ========================================================================= */}
        {viewTransaction && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Transaction Voucher</span>
                  <h3 className="font-serif text-lg font-bold text-forest">{viewTransaction.id}</h3>
                </div>
                <button
                  onClick={() => setViewTransaction(null)}
                  className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-canvas border border-editorial-border">
                  <span className="text-muted">Amount</span>
                  <span className={`font-mono font-bold text-lg ${
                    viewTransaction.type === 'income' ? 'text-emerald-700' : 'text-coral'
                  }`}>
                    {viewTransaction.type === 'income' ? '+' : '-'}
                    {formatINR(viewTransaction.amount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-mono">Date</span>
                    <span className="font-semibold text-ink">{viewTransaction.date}</span>
                  </div>
                  <div>
                    <span className="text-muted block text-[10px] uppercase font-mono">Category</span>
                    <span className="font-semibold text-ink">{viewTransaction.category}</span>
                  </div>
                </div>

                <div>
                  <span className="text-muted block text-[10px] uppercase font-mono">
                    {viewTransaction.type === 'income' ? 'Received From' : 'Paid To'}
                  </span>
                  <span className="font-semibold text-ink">{viewTransaction.counterparty}</span>
                </div>

                <div>
                  <span className="text-muted block text-[10px] uppercase font-mono">Description</span>
                  <p className="text-ink font-medium leading-relaxed">{viewTransaction.description}</p>
                </div>

                {viewTransaction.notes && (
                  <div className="p-3 bg-canvas/70 rounded-lg border border-editorial-border">
                    <span className="text-muted block text-[10px] uppercase font-mono mb-0.5">Notes</span>
                    <p className="text-muted text-[11px] font-sans">{viewTransaction.notes}</p>
                  </div>
                )}

                {viewTransaction.receiptUrl && (
                  <div className="pt-2">
                    <a
                      href={viewTransaction.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-forest hover:text-coral font-medium"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>View Receipt / Invoice Attachment</span>
                    </a>
                  </div>
                )}

                <div className="pt-3 border-t border-editorial-border flex items-center justify-between text-[11px] font-mono text-muted">
                  <span>Recorded by: {viewTransaction.addedBy}</span>
                  <span>Balance After: {formatINR(viewTransaction.balanceAfter)}</span>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setViewTransaction(null)}
                  className="px-4 py-2 bg-canvas hover:bg-canvas-subtle border border-editorial-border rounded-lg text-xs font-semibold text-ink transition-colors"
                >
                  Close Voucher
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 4: AUDIT TRAIL LOGS
           ========================================================================= */}
        {auditModalOpen && (
          <div className="fixed inset-0 z-50 bg-forest/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white border border-editorial-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-ink">
              <div className="flex items-center justify-between border-b border-editorial-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-forest" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-forest">Treasury Audit Trail</h3>
                    <p className="text-xs text-muted">Immutable log of financial events, ledger edits, and administrative entries.</p>
                  </div>
                </div>
                <button
                  onClick={() => setAuditModalOpen(false)}
                  className="p-1 text-muted hover:text-forest rounded-lg hover:bg-canvas transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-canvas border border-editorial-border flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-bold ${
                          log.action === 'create'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'delete'
                            ? 'bg-coral/15 text-coral'
                            : log.action === 'update'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-forest/10 text-forest'
                        }`}>
                          {log.action}
                        </span>
                        {log.transactionId && (
                          <span className="font-mono text-[11px] text-muted">{log.transactionId}</span>
                        )}
                        <span className="text-[10px] font-mono text-muted">by {log.performedBy}</span>
                      </div>
                      <p className="text-ink font-medium leading-relaxed">{log.details}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-3 border-t border-editorial-border flex justify-end">
                <button
                  onClick={() => setAuditModalOpen(false)}
                  className="px-4 py-2 bg-canvas hover:bg-canvas-subtle border border-editorial-border rounded-lg text-xs font-semibold text-ink"
                >
                  Close Audit Trail
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { TransactionType } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required to access private class finance.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const type = (searchParams.get('type') as TransactionType) || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;

    const summary = db.getFinanceSummary();
    const transactions = db.getFinanceTransactions({
      type,
      category,
      search,
      startDate,
      endDate,
    });
    const auditLogs = db.getFinanceAuditLogs();

    return NextResponse.json({
      success: true,
      summary,
      transactions,
      auditLogs,
    });
  } catch (error) {
    console.error('Error fetching finance records:', error);
    return NextResponse.json({ error: 'Failed to fetch financial records' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, category, amount, date, counterparty, description, notes, receiptUrl } = body;

    if (!type || (type !== 'income' && type !== 'expense')) {
      return NextResponse.json(
        { error: 'Invalid transaction type. Must be either "income" or "expense".' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json(
        { error: 'Transaction amount must be a valid positive number.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { error: 'Transaction category is required.' },
        { status: 400 }
      );
    }

    if (!counterparty || typeof counterparty !== 'string' || !counterparty.trim()) {
      return NextResponse.json(
        { error: type === 'income' ? 'Received from is required.' : 'Paid to is required.' },
        { status: 400 }
      );
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json(
        { error: 'Transaction description is required.' },
        { status: 400 }
      );
    }

    const finalDate = date && !isNaN(Date.parse(date))
      ? date
      : new Date().toISOString().split('T')[0];

    const result = db.createFinanceTransaction({
      type,
      category: category.trim() as any,
      amount: numAmount,
      date: finalDate,
      counterparty: counterparty.trim(),
      description: description.trim(),
      notes: notes ? String(notes).trim() : undefined,
      receiptUrl: receiptUrl ? String(receiptUrl).trim() : undefined,
      addedBy: session.username || 'admin',
    });

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
      summary: result.summary,
    });
  } catch (error) {
    console.error('Error creating finance transaction:', error);
    return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
  }
}

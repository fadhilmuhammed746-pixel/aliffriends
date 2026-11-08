import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await db.getFinanceTransactionById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    if (body.amount !== undefined) {
      const numAmount = Number(body.amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        return NextResponse.json({ error: 'Amount must be greater than zero.' }, { status: 400 });
      }
    }

    const result = await db.updateFinanceTransaction(id, body, session.username || 'admin');

    if (!result.transaction) {
      return NextResponse.json({ error: 'Failed to update transaction.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      transaction: result.transaction,
      summary: result.summary,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Administrator authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const result = await db.deleteFinanceTransaction(id, session.username || 'admin');

    if (!result.success) {
      return NextResponse.json({ error: 'Transaction not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      summary: result.summary,
    });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const summary = db.getFinanceSummary();
    const transactions = db.getFinanceTransactions();

    // Generate CSV content
    const header = [
      'Transaction ID',
      'Date',
      'Type',
      'Category',
      'Counterparty',
      'Description',
      'Amount (INR)',
      'Balance After (INR)',
      'Added By',
      'Notes',
    ];

    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type.toUpperCase(),
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.counterparty || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.type === 'income' ? `+${t.amount}` : `-${t.amount}`,
      t.balanceAfter,
      `"${(t.addedBy || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvLines = [
      `# ALIF FRIENDS 12 CLASS FINANCE LEDGER`,
      `# Generated On: ${new Date().toISOString()}`,
      `# Opening Balance: INR ${summary.openingBalance}`,
      `# Current Balance: INR ${summary.currentBalance}`,
      `# Total Income: INR ${summary.totalIncome}`,
      `# Total Expenses: INR ${summary.totalExpenses}`,
      '',
      header.join(','),
      ...rows.map((r) => r.join(',')),
    ];

    const csvContent = csvLines.join('\r\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="alif-friends-12-finance-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting finance CSV:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

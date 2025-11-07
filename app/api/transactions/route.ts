import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { verifyToken } from '@/lib/auth';

async function getUserIdFromRequest(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return null;
  
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

// GET all transactions for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1, createdAt: -1 });

    return NextResponse.json(
      { success: true, transactions },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new transaction
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    const { type, description, amount, category, date } = await request.json();

    // Validation
    if (!type || !description || !amount || !category || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create({
      userId,
      type,
      description,
      amount: parseFloat(amount),
      category,
      date,
    });

    return NextResponse.json(
      { success: true, transaction },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE transaction
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();
    
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId, // Ensure user can only delete their own transactions
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Transaction deleted' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete transaction error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

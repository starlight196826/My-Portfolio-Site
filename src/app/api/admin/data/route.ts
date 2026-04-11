import { NextRequest, NextResponse } from 'next/server';

// This would be stored in a database in production
// For now, we'll use localStorage on the client side
export async function GET() {
  try {
    // Return success message - actual data is managed on client side
    return NextResponse.json({
      success: true,
      message: 'Admin data endpoint ready',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In production, save to database
    // For now, data is managed on client side with localStorage
    return NextResponse.json({
      success: true,
      message: 'Data saved successfully',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

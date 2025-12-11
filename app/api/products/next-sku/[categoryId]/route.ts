import { NextResponse } from 'next/server';
import { generateSKU } from '@/lib/utils/sku-generator';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { categoryId: categoryIdStr } = await params;
    const categoryId = parseInt(categoryIdStr);
    const nextSKU = await generateSKU(categoryId);
    return NextResponse.json({ sku: nextSKU });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate SKU' }, { status: 500 });
  }
}

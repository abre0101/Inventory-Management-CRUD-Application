import { NextResponse } from 'next/server';
import { generateSKU } from '@/lib/utils/sku-generator';

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = parseInt(params.categoryId);
    const nextSKU = await generateSKU(categoryId);
    return NextResponse.json({ sku: nextSKU });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate SKU' }, { status: 500 });
  }
}

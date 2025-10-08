import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with credentials
cloudinary.config({
  cloud_name: 'dcko1bbmr',
  api_key: '787222787734836',
  api_secret: 'KXKCDL1gZtyeMt6ty7R_2ztIgig',
});

export async function POST(request: Request) {
  const { public_id } = await request.json();

  if (!public_id) {
    return NextResponse.json({ error: 'Image public_id is required.' }, { status: 400 });
  }

  try {
    // The 'destroy' method is used to delete an image.
    const result = await cloudinary.uploader.destroy(public_id);

    // The result from a successful deletion is { result: 'ok' }
    if (result.result !== 'ok') {
        // If the image wasn't found or another error occurred
        return NextResponse.json({ error: `Failed to delete image: ${result.result}` }, { status: 500 });
    }

    return NextResponse.json({ message: 'Image deleted successfully.' });
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete image.' }, { status: 500 });
  }
}

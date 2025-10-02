
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'lux-g-modern-collections',
  api_key: '625323497893845',
  api_secret: 'Rvg6tHBL43V2b1i4a6eJv1d-o2o',
});

export async function POST(request: Request) {
  const { file, folder } = await request.json();

  if (!file) {
    return NextResponse.json({ error: 'No file data provided.' }, { status: 400 });
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: folder || 'lux_g_store', // Default folder
    });

    return NextResponse.json({
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload image.' }, { status: 500 });
  }
}

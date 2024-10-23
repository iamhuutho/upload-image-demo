import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';  // For unique file naming

const prisma = new PrismaClient();

// Configure AWS SDK with S3 details
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      include: { comments: true },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { file, fileName, fileType } = await request.json();
  console.log(file)
  // Generate a unique key for each upload
  const key = `photos/${fileName}`;

  const s3Params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME || '', // Ensure that the variable is defined and has a value
    Key: key,
    Body: file, // Assuming file is base64 encoded
    ContentType: fileType,
    ACL: 'private',
  };
  console.log(s3Params);
  try {
    // Upload to S3
    const data = await s3.upload(s3Params).promise();
    const photoUrl = data.Location;

    const photo = await prisma.photo.create({
      data: { url: photoUrl },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}

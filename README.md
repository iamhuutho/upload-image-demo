# Photo Gallery App

## Overview

Photo Gallery App is a web application that allows users to upload and share photos, as well as add comments to their favorite images. Built with Next.js and a PostgreSQL database hosted on Amazon RDS, this application is designed for both ease of use and scalability.

## Features

- Upload photos with a simple drag-and-drop interface
- View photos in a gallery layout
- Add comments to photos
- Responsive design for optimal viewing on different devices

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: Node.js, Express (API routes in Next.js)
- **Database**: PostgreSQL hosted on Amazon RDS
- **Storage**: Amazon S3 for image uploads
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- AWS account for S3

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/photo-gallery-app.git
   cd photo-gallery-app
   ```
2. Create a .env file based on the .env.template file and fill in all necessary information.
   ```bash
   DATABASE_URL=
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   AWS_REGION=
   AWS_S3_BUCKET_NAME=
   ```
   
3. Run the following command to initialize your database:

   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000` to view the app.

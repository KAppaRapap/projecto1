# Deployment Guide

This guide will help you deploy your Next.js application to Vercel, which is the recommended hosting platform for Next.js applications.

## Prerequisites

1. Create a [Vercel account](https://vercel.com/signup) if you don't have one
2. Install Vercel CLI (optional but recommended):
   ```bash
   npm install -g vercel
   ```

## Environment Variables

Before deploying, make sure to have these environment variables ready:
- NEXT_PUBLIC_YOUTUBE_API_KEY
- NEXT_PUBLIC_TWITCH_CLIENT_ID
- NEXT_PUBLIC_TWITCH_CLIENT_SECRET

## Deployment Steps

### Option 1: Deploy with Vercel CLI (Recommended)

1. Open terminal in your project directory
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy the project:
   ```bash
   vercel
   ```
4. Follow the CLI prompts
5. When asked about environment variables, add them as configured in your .env.local

### Option 2: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository or upload your project files
4. Configure your project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
5. Add Environment Variables:
   - Go to Project Settings > Environment Variables
   - Add all required environment variables
6. Deploy

## After Deployment

1. Vercel will provide you with a deployment URL
2. Test your application thoroughly
3. Set up a custom domain if needed:
   - Go to Project Settings > Domains
   - Add your domain and follow the DNS configuration instructions

## Troubleshooting

If you encounter any issues:
1. Check the build logs in Vercel dashboard
2. Verify environment variables are correctly set
3. Ensure all API keys are valid
4. Check if all dependencies are properly installed

## Automatic Deployments

Vercel automatically deploys:
- When you push to your main branch
- When you create a pull request (preview deployment)

You can configure deployment settings in your Vercel project dashboard.
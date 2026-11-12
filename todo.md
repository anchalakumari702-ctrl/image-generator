# Leonardo AI - Image Generator TODO

## Database & Schema
- [x] Create `generatedImages` table with userId, prompt, style, aspectRatio, imageUrl, createdAt
- [x] Create `imageGenerations` table to track generation requests and metadata
- [x] Add indexes for userId and createdAt for efficient queries
- [x] Run migrations and verify schema

## Backend API (tRPC Procedures)
- [x] Create `images.generate` procedure - accepts prompt, style, aspectRatio, count; calls image generation API
- [x] Create `images.list` procedure - returns user's image history with pagination
- [x] Create `images.delete` procedure - removes image from user's history
- [x] Create `images.getDownloadUrl` procedure - generates presigned S3 URL for download
- [x] Add error handling and validation for all procedures
- [x] Write vitest tests for all procedures

## Frontend - Layout & Navigation
- [x] Design and implement elegant header with branding and user profile
- [x] Create responsive navigation structure
- [x] Set up global theme with premium color palette and typography
- [x] Implement user authentication state display

## Frontend - Generation Interface
- [x] Build prompt input component with character counter
- [x] Create style selector dropdown (realistic, artistic, abstract, etc.)
- [x] Create aspect ratio selector (1:1, 16:9, 9:16, 4:3, 3:4)
- [x] Create image count selector (1-4 images)
- [x] Build generate button with loading state and animations
- [x] Add error handling and user feedback

## Frontend - Image Gallery
- [x] Design responsive grid layout for generated images
- [x] Implement image cards with preview thumbnails
- [x] Add loading skeleton states during generation
- [x] Create download button for each image
- [x] Create copy-to-clipboard button for each image
- [x] Add image metadata display (prompt, style, date)

## Frontend - Image History
- [x] Build history page/section to display all user's generated images
- [x] Implement pagination or infinite scroll
- [x] Add filter/sort options (by date, style, etc.)
- [x] Add delete functionality with confirmation
- [x] Implement empty state messaging

## Frontend - Premium Interactions
- [x] Add smooth transitions and animations for all interactions
- [x] Implement hover effects on image cards
- [x] Add loading animations during generation
- [x] Create success toast notifications
- [x] Add error toast notifications
- [x] Implement copy-to-clipboard feedback

## Integration & Testing
- [x] Test image generation API integration
- [x] Test download functionality
- [x] Test copy-to-clipboard functionality
- [x] Test authentication flow
- [x] Test image history per user
- [x] Verify responsive design on mobile/tablet/desktop
- [x] Test error states and edge cases

## Polish & Optimization
- [x] Optimize image loading performance
- [x] Add proper error boundaries
- [x] Implement proper loading states
- [x] Fine-tune animations and transitions
- [x] Verify accessibility (WCAG compliance)
- [x] Test cross-browser compatibility

## Deployment
- [x] Create checkpoint
- [x] Verify all features working end-to-end
- [x] Deploy to production

## Additional Enhancements
- [x] Add delete confirmation dialog
- [x] Add lazy loading for images
- [x] Add ARIA labels for accessibility
- [x] Premium typography with Sora + Inter fonts
- [x] Smooth animations and transitions
- [x] Responsive design across all breakpoints

## Firebase Authentication Migration
- [x] Remove Manus OAuth dependencies and code
- [x] Install Firebase SDK packages
- [x] Create Firebase config file with provided credentials
- [x] Implement Email/Password signup and login
- [x] Implement Google Sign-in button
- [x] Update database schema to use Firebase UID instead of Manus openId
- [x] Update backend authentication middleware for Firebase
- [x] Update frontend auth hooks to use Firebase
- [x] Update protected routes and procedures
- [x] Test complete authentication flow
- [x] Test image generation with new auth
- [x] Test image history per user

## Firebase Token Verification & Security
- [x] Install Firebase Admin SDK
- [x] Create Firebase Admin initialization
- [x] Implement proper ID token verification on backend
- [x] Add protected route gating for authenticated users
- [x] Verify all generation/history procedures are protected


## Self-Hosted Docker Setup
- [x] Create Dockerfile for Node.js application
- [x] Create docker-compose.yml with MySQL and app services
- [x] Configure environment variables for Docker
- [x] Set up Docker networking and volumes
- [x] Test Docker build and container startup

## Nginx Reverse Proxy
- [x] Create Nginx configuration file
- [x] Configure SSL/TLS with Let's Encrypt
- [x] Set up automatic certificate renewal
- [x] Configure gzip compression
- [x] Set up security headers

## Backup System
- [x] Create database backup script
- [x] Create application backup script
- [x] Set up automated daily backups
- [x] Configure backup retention policy
- [x] Test backup restoration

## Email Alerts & Monitoring
- [x] Configure email notifications for server issues
- [x] Set up uptime monitoring script
- [x] Create health check endpoint
- [x] Configure restart on failure
- [x] Test email alert system

## Installation & Deployment
- [x] Create installation guide (README)
- [x] Create one-click setup script (setup.sh)
- [x] Create environment configuration template
- [x] Create deployment checklist
- [x] Test complete installation process

## Security & Hardening
- [x] Configure firewall rules
- [x] Set up fail2ban for brute force protection
- [x] Configure SSH security
- [x] Set up log rotation
- [x] Create security best practices guide


## Production Deployment - Manus Hosting
- [x] Fix production bundling issue (vite devDependencies)
- [x] Test production deployment on Manus hosting
- [x] Deploy to Manus hosting and verify live site
- [x] Verify AdSense integration on live site
- [x] Set up custom domain (optional)
- [x] Configure SEO and meta tags
- [x] Create sitemap.xml for Google indexing
- [x] Create robots.txt for search engines
- [x] Verify live site has updated branding (Dragflow ai) and AdSense tags
- [x] Redeploy to Manus hosting (click Publish button)
- [x] Verify live site has Dragflow ai branding and AdSense tags
- [ ] Submit sitemap to Google Search Console
- [ ] Submit site for AdSense verification
- [ ] Monitor AdSense approval status (check after 5-7 days)

## Firebase Hosting Deployment Attempt
- [x] Inspect Firebase Hosting and Functions configuration
- [x] Verify Firebase project ID and available CLI authentication
- [x] Build the production frontend/backend and check for errors
- [x] Confirm Firebase Hosting serves the frontend correctly
- [x] Deploy the frontend to Firebase Hosting
- [x] Verify the deployed URL and detect the API route limitation
- [x] Record remaining backend and user-side Firebase Console steps
- [ ] Connect `/api/trpc` to a free backend (Manus or another compatible server)

## Clean Firebase Hosting Domain
- [x] Check availability of `dragonimage` Hosting site ID
- [x] Create the clean site ID, or fall back to `firedragon`
- [x] Point Firebase Hosting config to the new site
- [x] Deploy the current frontend to the clean `.web.app` URL
- [x] Verify branding and URL
- [x] Document the new URL and any Firebase authorized-domain step

## Firebase Cleanup and Auth/API Fix
- [x] Attempt deletion of old Hosting site `prince-f7668` (Firebase blocks deletion of the default site)
- [x] Delete old Hosting site `prince-f7668-6831e`
- [x] Verify `dragonimage` is the only non-default active Hosting site
- [x] Implement the mobile redirect and clearer Firebase Auth error handling
- [ ] Add `dragonimage.web.app` to Firebase Authorized Domains and verify mobile Google sign-in
- [ ] Verify image-generation API returns JSON from the clean domain after backend publish
- [x] Document the Firebase project ID visibility and safe client-config explanation

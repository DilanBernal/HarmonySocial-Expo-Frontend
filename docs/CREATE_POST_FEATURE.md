# Create Post Feature Documentation

## Overview

The Create Post feature is a multistep form that allows users to create different types of posts (music, text, image, video) with proper validation and a smooth user experience.

## Architecture

### Components

#### `MultiStepPostForm.tsx`
Main form component that orchestrates the three-step process.

**Props:**
- `onSuccess?: () => void` - Callback executed after successful post creation
- `initialValues?: Partial<PostFormValues>` - Optional initial form values

**Features:**
- Three-step wizard interface
- Real-time form validation using react-hook-form + yup
- Error handling and user feedback
- Loading states during submission
- Success/error alerts

#### Step Components

1. **`step1-basic-info.tsx`** - Category and Basic Information
   - Category selection (music, text, image, video)
   - Title input (required, 3-100 chars)
   - Short description input (required, 10-150 chars)

2. **`step2-content.tsx`** - Dynamic Content Based on Category
   - **Music**: Song picker with search + description (required)
   - **Text**: Long-form content editor (required)
   - **Image/Video**: Media placeholder + optional description

3. **`step3-review.tsx`** - Review and Confirmation
   - Display all entered information
   - Show auto-filled fields preview
   - Final submission

### Services

#### `PostService.ts`
Handles all post-related API operations using RxJS + Axios pattern.

**Methods:**
- `createPost(payload: PostPayload): Observable<PostEntity>`

### Types

All type definitions are in `core/types/post.ts`:
- `PostFormValues` - User input
- `PostPayload` - API request
- `PostEntity` - API response
- `PostCategory` - Category enum

### Validation

Yup schemas in `core/types/schemas/postValidationSchema.ts` with conditional rules based on post category.

## User Flow

1. Navigate to Create Post Screen
2. Step 1: Choose category and add basic info
3. Step 2: Add category-specific content
4. Step 3: Review and submit
5. Success: Navigate back to feed

## Auto-Filled Fields

- `publication_date`: Current timestamp
- `comments_number`: 0
- `likes_number`: 0
- `user_id`: From AuthUserService

## API Integration

**Endpoint:** `POST /posts`

See full documentation in implementation files.

## Testing Checklist

- [ ] Create posts for each category
- [ ] Test validation for all fields
- [ ] Test song search functionality
- [ ] Test success and error flows
- [ ] Verify navigation after submission

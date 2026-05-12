# Admin Source Code File Display Fix

## Problem

The admin application review page was showing "No File Uploaded" even when sellers had uploaded folders or files. This was because the admin page was only checking if `sourceCodeFile` exists, but not checking if it has a valid `url` property.

## Root Cause

When sellers upload files or folders:

1. **Direct ZIP Upload**: Creates `sourceCodeFile` object with `url`, `fileId`, `fileName`, `fileSize`
2. **Folder Upload**: Converts folder to ZIP and creates same structure with additional `originalFileCount` field

The admin page was checking:

```javascript
{application.sourceCodeFile && (
  // Show file uploaded
)}
```

But it should have been checking:

```javascript
{application.sourceCodeFile && application.sourceCodeFile.url && (
  // Show file uploaded
)}
```

## Changes Made

### File: `src/pages/admin/AdminApplicationDetail.jsx`

#### 1. Main Content Section - Application ZIP File Card

**Before:**

```javascript
{
  application.sourceCodeFile && <Card>...</Card>;
}
```

**After:**

```javascript
{
  application.sourceCodeFile && application.sourceCodeFile.url && (
    <Card>...</Card>
  );
}
```

**Added Features:**

- Check for both `sourceCodeFile` AND `sourceCodeFile.url`
- Display upload type (Direct ZIP vs Folder Upload)
- Show original file count for folder uploads
- Better upload status detection (checks both `uploaded` flag and `url` presence)

#### 2. Warning Card for Missing Files

**Before:**

```javascript
{
  !application.sourceCodeFile && <Card>No File Uploaded</Card>;
}
```

**After:**

```javascript
{
  (!application.sourceCodeFile || !application.sourceCodeFile.url) && (
    <Card>No File Uploaded</Card>
  );
}
```

#### 3. Right Sidebar - Source Code Status Card

**Before:**

```javascript
<Card sx={{ borderColor: application.sourceCodeFile ? 'success.main' : 'error.main' }}>
  {application.sourceCodeFile ? (
    // Show uploaded
  ) : (
    // Show not uploaded
  )}
</Card>
```

**After:**

```javascript
<Card sx={{ borderColor: (application.sourceCodeFile && application.sourceCodeFile.url) ? 'success.main' : 'error.main' }}>
  {(application.sourceCodeFile && application.sourceCodeFile.url) ? (
    // Show uploaded with folder/file distinction
  ) : (
    // Show not uploaded
  )}
</Card>
```

**Added Features:**

- Distinguish between folder uploads and direct ZIP uploads
- Show file count for folder uploads
- More robust URL checking

#### 4. Debug Logging

Added console logging in `fetchApplicationDetail` to help diagnose issues:

```javascript
console.log("Application Data:", {
  appName: app.appName,
  hasSourceCodeFile: !!app.sourceCodeFile,
  sourceCodeFileUrl: app.sourceCodeFile?.url,
  sourceCodeFileStructure: app.sourceCodeFile,
});
```

## Testing

To verify the fix works:

1. **Test with Folder Upload:**
   - Seller uploads a folder
   - Admin should see: "Folder Uploaded (as ZIP)" with file count
   - Download button should work

2. **Test with Direct ZIP Upload:**
   - Seller uploads a ZIP file directly
   - Admin should see: "ZIP File Uploaded"
   - Download button should work

3. **Test with No Upload:**
   - Application without file
   - Admin should see: "No File Uploaded" warning in red

4. **Check Browser Console:**
   - Open DevTools Console
   - Look for "Application Data:" log
   - Verify `sourceCodeFileUrl` is present when file is uploaded

## Data Structure

The `sourceCodeFile` object structure:

```javascript
{
  url: "https://ik.imagekit.io/...",
  fileId: "abc123",
  fileName: "my-app.zip",
  fileSize: 5242880, // bytes
  uploaded: true,
  originalFileCount: 25 // Only present for folder uploads
}
```

## Related Files

- Seller upload logic: `src/pages/seller/CreateApplication.jsx`
- Seller edit logic: `src/pages/seller/EditApplication.jsx`
- Seller list view: `src/pages/seller/AllApplications.jsx`

## Notes

- The seller pages already had the correct check: `!app?.sourceCodeFile || !app?.sourceCodeFile?.url`
- This fix aligns the admin page with the seller page logic
- The fix handles both folder uploads (converted to ZIP) and direct ZIP uploads

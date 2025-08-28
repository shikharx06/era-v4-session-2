# 🧪 Upload Functionality Testing Guide

## Current Status ✅

- **FastAPI Server**: Running on http://localhost:8000 ✅
- **Next.js App**: Running on http://localhost:3001 ✅
- **API Upload**: Working via curl ✅
- **AI Model**: Loaded and generating descriptions ✅

## Testing Steps

### 1. Test FastAPI Upload Directly

```bash
# Create test image
cd fastapi-image-server
uv run python -c "from PIL import Image; img = Image.new('RGB', (100, 100), color='blue'); img.save('../test_blue.jpg')"

# Test upload
cd ..
curl -X POST http://localhost:8000/upload -F "file=@test_blue.jpg"
```

### 2. Test with HTML Test Page

1. Open: `file:///Users/shikharsingh/Documents/era/session_2/test_upload.html`
2. Select the `test_blue.jpg` file
3. Click "Upload Image"
4. Check browser console (F12) for any errors

### 3. Test Next.js App Upload

1. Open: http://localhost:3001
2. Click "Upload an image" button
3. Select any image file
4. Open browser dev tools (F12) to see console logs
5. Check for:
   - "File selected:" log message
   - "Uploading to:" log message
   - "Upload response status:" log message
   - Any error messages

## Debugging Checklist

### If upload button doesn't respond:

- [ ] Check browser console for JavaScript errors
- [ ] Verify file input is actually triggering
- [ ] Check if `onFileChange` function is being called

### If upload fails:

- [ ] CORS error: Check browser console for CORS messages
- [ ] Network error: Check if FastAPI server is running on port 8000
- [ ] File type error: Ensure you're uploading an image file

### If upload succeeds but navigation fails:

- [ ] Check console for "Navigating to upload page" message
- [ ] Verify URL parameters are being generated correctly
- [ ] Check if `/upload` page loads properly

## Expected Behavior

1. **File Selection**: Console shows "File selected: filename.jpg"
2. **Upload Start**: Button shows "Uploading..." and is disabled
3. **Upload Progress**: Console shows "Uploading to: http://localhost:8000/upload"
4. **Upload Response**: Console shows "Upload response status: 200"
5. **Upload Success**: Console shows "Upload successful: {data}"
6. **Navigation**: Page redirects to `/upload?imageId=...&description=...`
7. **Results Display**: Upload page shows AI description and metadata

## Common Issues & Solutions

### Issue: "Failed to connect to localhost port 8000"

**Solution**: Start FastAPI server

```bash
cd fastapi-image-server
uv run python main.py
```

### Issue: CORS errors in browser console

**Solution**: FastAPI CORS should be configured for `allow_origins=["*"]`

### Issue: Upload button doesn't show loading state

**Solution**: Check if `isUploading` state is working properly

### Issue: No console logs appear

**Solution**: Make sure browser dev tools are open and console is visible

## Manual Verification Commands

```bash
# Check FastAPI is running
curl http://localhost:8000/

# Check Next.js is running
curl http://localhost:3001/

# Test upload directly
curl -X POST http://localhost:8000/upload -F "file=@test_blue.jpg" | jq

# Check CORS headers
curl -X OPTIONS -H "Origin: http://localhost:3001" -v http://localhost:8000/upload
```

## Success Indicators

When everything works correctly:
✅ Browser console shows file selection log
✅ Upload button shows loading state
✅ API call succeeds (status 200)
✅ Page navigates to `/upload` route
✅ Results page displays AI description
✅ Image preview loads (if image serving works)

## Debug Mode

Add this to the Next.js page for extra debugging:

```javascript
console.log('Upload function called');
console.log('File input element:', e.target);
console.log('Selected files:', e.target.files);
```

# 🚀 Image Analysis Full-Stack Integration

This project demonstrates a complete integration between a **Next.js webapp** and a **FastAPI backend** for AI-powered image analysis.

## 🏗️ Architecture

```
┌─────────────────┐    HTTP POST     ┌─────────────────┐
│                 │   /upload        │                 │
│   Next.js App   │ ───────────────► │   FastAPI API   │
│  (Frontend)     │                  │   (Backend)     │
│                 │ ◄─────────────── │                 │
└─────────────────┘    JSON         └─────────────────┘
     Port 3000       Response             Port 8000
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │   BLIP Model    │
                                  │ (AI Description)│
                                  └─────────────────┘
```

## 🎯 Features

### Frontend (Next.js + HeroUI)

- 🖼️ **Animal Gallery**: Pre-built galleries for cats, dogs, and elephants
- 📤 **Image Upload**: Drag-and-drop or click to upload images
- 🎨 **Dark Mode**: Beautiful dark theme with HeroUI components
- 📱 **Responsive**: Works on desktop and mobile devices
- ⚡ **Real-time Upload**: Shows progress and loading states

### Backend (FastAPI + AI)

- 🧠 **AI Description**: BLIP model for intelligent image captioning
- 📊 **Metadata Extraction**: File size, dimensions, EXIF data
- 🗄️ **Image Storage**: Secure file storage with unique IDs
- 🔗 **Image Serving**: Direct image access via URL
- 📋 **Image Management**: List and analyze uploaded images

## 🚀 Quick Start

### 1. Start the FastAPI Server

```bash
cd fastapi-image-server
uv run python main.py
```

Server runs at: `http://localhost:8000`

### 2. Start the Next.js App

```bash
cd demo-webapp
npm run dev
```

App runs at: `http://localhost:3000`

### 3. Test the Integration

```bash
cd session_2
uv run python integration_test.py
```

## 🔄 Upload Workflow

1. **User clicks "Upload an image"** on the Next.js frontend
2. **File is selected** via the browser file picker
3. **Frontend uploads** to FastAPI `/upload` endpoint
4. **FastAPI processes** the image:
   - Saves file with unique UUID
   - Extracts metadata (size, format, EXIF)
   - Runs AI analysis using BLIP model
5. **API returns** complete analysis data
6. **Frontend navigates** to results page with AI description
7. **Image is displayed** from FastAPI `/uploads/{id}` endpoint

## 📡 API Endpoints

### FastAPI Backend (`localhost:8000`)

| Method | Endpoint         | Description                      |
| ------ | ---------------- | -------------------------------- |
| `GET`  | `/`              | Health check and API info        |
| `POST` | `/upload`        | Upload image and get AI analysis |
| `GET`  | `/analyze/{id}`  | Re-analyze existing image        |
| `GET`  | `/metadata/{id}` | Get image metadata only          |
| `GET`  | `/images`        | List all uploaded images         |
| `GET`  | `/uploads/{id}`  | Serve uploaded image file        |

### Example Upload Response

```json
{
  "image_id": "uuid-here",
  "original_filename": "my_cat.jpg",
  "description": "a cat sitting on a wooden table",
  "metadata": {
    "format": "JPEG",
    "size": {"width": 1920, "height": 1080},
    "file_size": 245760,
    "exif": {...}
  },
  "upload_time": "2024-01-01T12:00:00"
}
```

## 🎨 Frontend Pages

### Next.js App (`localhost:3000`)

| Route               | Description                                |
| ------------------- | ------------------------------------------ |
| `/`                 | Main page with animal selection and upload |
| `/animals/[animal]` | Animal galleries (cat, dog, elephant)      |
| `/upload`           | Upload results with AI description         |

## 🧪 Testing

### Manual Testing

1. Open `http://localhost:3000`
2. Click "Upload an image"
3. Select any image file
4. View AI-generated description and metadata

### Automated Testing

```bash
# Test FastAPI only
cd fastapi-image-server
uv run python test_api.py

# Test full integration
cd session_2
uv run python integration_test.py
```

## 🔧 Configuration

### CORS Settings

The FastAPI server allows all origins for development:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Image Storage

- Images stored in: `fastapi-image-server/uploads/`
- Filename format: `{uuid}.{extension}`
- Supported formats: JPG, JPEG, PNG, GIF, BMP, WEBP

### AI Model

- Model: `Salesforce/blip-image-captioning-base`
- Auto-downloaded on first startup
- Runs on CPU (GPU support available)

## 📁 Project Structure

```
session_2/
├── demo-webapp/                 # Next.js frontend
│   ├── app/
│   │   ├── page.tsx            # Main upload page
│   │   ├── upload/page.tsx     # Results display
│   │   └── animals/[animal]/   # Animal galleries
│   ├── lib/animals.ts          # Animal data
│   └── package.json
├── fastapi-image-server/        # FastAPI backend
│   ├── main.py                 # Main API server
│   ├── uploads/                # Uploaded images
│   ├── test_api.py            # API tests
│   └── pyproject.toml
└── integration_test.py         # Full integration test
```

## 🚦 Service Status Check

Both services need to be running for full functionality:

- ✅ **FastAPI**: `curl http://localhost:8000/`
- ✅ **Next.js**: `curl http://localhost:3000/`

## 💡 Usage Examples

### Upload via Web Interface

1. Navigate to `http://localhost:3000`
2. Click "Upload an image"
3. Select image file
4. View AI description and metadata

### Upload via API

```bash
curl -X POST "http://localhost:8000/upload" \
  -F "file=@your-image.jpg"
```

### Get Image Analysis

```bash
curl "http://localhost:8000/analyze/{image-id}"
```

## 🔗 Key Integration Points

1. **File Upload**: Frontend sends FormData to `/upload`
2. **Real-time Processing**: AI analysis happens during upload
3. **Image Display**: Images served from `/uploads/{id}`
4. **Error Handling**: User-friendly error messages
5. **Loading States**: UI feedback during processing

## 🎉 Success Indicators

When everything works correctly:

- ✅ Upload button shows loading state
- ✅ AI generates meaningful descriptions
- ✅ Images display properly in results
- ✅ Metadata shows correct file information
- ✅ Navigation between pages works smoothly

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Check both servers are running
2. **AI model loading**: First startup takes time to download model
3. **Image not displaying**: Check image serving endpoint
4. **Upload fails**: Verify file format is supported

### Debug Commands

```bash
# Check if FastAPI is running
curl http://localhost:8000/

# Check if Next.js is running
curl http://localhost:3000/

# Test image upload
curl -X POST http://localhost:8000/upload -F "file=@test.jpg"
```

This integration showcases a modern full-stack application with AI capabilities, demonstrating how to connect a React-based frontend with a Python backend for image processing and analysis! 🚀

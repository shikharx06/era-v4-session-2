# Image Analysis API

A FastAPI server that provides image upload, AI-powered description generation, and metadata extraction capabilities.

## Features

- 🖼️ **Image Upload**: Upload images and save them securely on the server
- 🧠 **AI Description**: Generate intelligent descriptions using BLIP (Bootstrapping Language-Image Pre-training) model
- 📊 **Metadata Extraction**: Extract comprehensive image metadata including EXIF data
- 🔍 **Image Analysis**: Analyze previously uploaded images
- 📁 **Image Management**: List and manage uploaded images

## Setup

### Prerequisites

- Python 3.11+
- UV package manager

### Installation

1. **Clone and setup the project:**

   ```bash
   cd fastapi-image-server
   uv sync
   ```

2. **Run the server:**

   ```bash
   uv run python main.py
   ```

   Or using uvicorn directly:

   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

3. **Access the API:**
   - API Server: http://localhost:8000
   - Interactive Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## API Endpoints

### 1. Health Check

```
GET /
```

Returns API status and available endpoints.

### 2. Upload Image

```
POST /upload
```

Upload an image file and get immediate analysis.

**Request:**

- Form data with `file` field (image file)

**Response:**

```json
{
  "image_id": "uuid",
  "original_filename": "image.jpg",
  "saved_filename": "uuid.jpg",
  "file_path": "uploads/uuid.jpg",
  "description": "AI-generated description",
  "metadata": {
    "filename": "uuid.jpg",
    "format": "JPEG",
    "size": {"width": 1920, "height": 1080},
    "file_size": 245760,
    "exif": {...}
  },
  "upload_time": "2024-01-01T12:00:00"
}
```

### 3. Analyze Image

```
GET /analyze/{image_id}
```

Get AI analysis for a previously uploaded image.

### 4. Get Metadata

```
GET /metadata/{image_id}
```

Extract metadata from a previously uploaded image.

### 5. List Images

```
GET /images
```

List all uploaded images with basic info.

## Usage Examples

### Using curl

**Upload an image:**

```bash
curl -X POST "http://localhost:8000/upload" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/image.jpg"
```

**Get metadata:**

```bash
curl -X GET "http://localhost:8000/metadata/{image_id}"
```

### Using Python requests

```python
import requests

# Upload image
with open('image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/upload',
        files={'file': f}
    )
    result = response.json()
    print(f"Description: {result['description']}")

# Get analysis
image_id = result['image_id']
analysis = requests.get(f'http://localhost:8000/analyze/{image_id}').json()
print(f"Analysis: {analysis['description']}")
```

### Test Script

Run the comprehensive test script to verify all endpoints:

```bash
uv run python test_api.py
```

This script tests all API endpoints with a generated test image and displays the results.

## AI Model

The server uses the **Salesforce/blip-image-captioning-base** model from Hugging Face Transformers for generating image descriptions. The model is automatically downloaded on first startup.

## File Storage

- Uploaded images are stored in the `uploads/` directory
- Each image gets a unique UUID-based filename
- Original filenames are preserved in the response metadata

## Development

### Project Structure

```
fastapi-image-server/
├── main.py              # Main FastAPI application
├── uploads/             # Uploaded images directory
├── pyproject.toml       # UV project configuration
└── README.md           # This file
```

### Dependencies

- **FastAPI**: Web framework
- **Uvicorn**: ASGI server
- **Pillow**: Image processing
- **Transformers**: AI model inference
- **PyTorch**: ML backend
- **python-multipart**: File upload support

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive API documentation where you can test endpoints directly in your browser.

## Error Handling

The API includes comprehensive error handling for:

- Invalid file formats
- Corrupted images
- Missing files
- AI model errors
- File system issues

All errors return appropriate HTTP status codes with descriptive messages.

## CORS Support

The API includes CORS middleware to allow frontend applications to connect from different origins. In production, configure specific allowed origins for security.

## License

This project is for educational and demonstration purposes.

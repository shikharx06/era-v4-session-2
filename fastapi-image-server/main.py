import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, Any
from contextlib import asynccontextmanager

import torch
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, ExifTags
from transformers import BlipProcessor, BlipForConditionalGeneration
import uvicorn

# Initialize AI model for image description
processor = None
model = None


def load_ai_model():
    """Load the BLIP model for image captioning"""
    global processor, model
    try:
        processor = BlipProcessor.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )
        model = BlipForConditionalGeneration.from_pretrained(
            "Salesforce/blip-image-captioning-base"
        )
        print("AI model loaded successfully")
    except Exception as e:
        print(f"Error loading AI model: {e}")
        processor = None
        model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    load_ai_model()
    # Create uploads directory if it doesn't exist
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    print("FastAPI server startup complete")

    yield

    # Shutdown
    print("FastAPI server shutting down")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Image Analysis API",
    description="Upload images and get AI-generated descriptions with metadata",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_image_metadata(image_path: str) -> Dict[str, Any]:
    """Extract metadata from an image file"""
    try:
        with Image.open(image_path) as img:
            # Basic image info
            metadata = {
                "filename": Path(image_path).name,
                "format": img.format,
                "mode": img.mode,
                "size": {"width": img.width, "height": img.height},
                "file_size": os.path.getsize(image_path),
                "created_at": datetime.now().isoformat(),
            }

            # EXIF data if available
            exif_data = {}
            if hasattr(img, "_getexif") and img._getexif() is not None:
                exif = img._getexif()
                for tag_id, value in exif.items():
                    tag = ExifTags.TAGS.get(tag_id, tag_id)
                    exif_data[tag] = str(value)

            metadata["exif"] = exif_data
            return metadata

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error extracting metadata: {str(e)}"
        )


def generate_image_description(image_path: str) -> str:
    """Generate AI description for an image"""
    if not processor or not model:
        return "AI model not available. Using basic description based on filename."

    try:
        # Load and process image
        image = Image.open(image_path).convert("RGB")

        # Generate description
        inputs = processor(image, return_tensors="pt")

        with torch.no_grad():
            out = model.generate(**inputs, max_length=50, num_beams=5)

        description = processor.decode(out[0], skip_special_tokens=True)
        return description

    except Exception as e:
        print(f"Error generating description: {e}")
        return f"Unable to generate AI description. Error: {str(e)}"


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Image Analysis API is running",
        "ai_model_loaded": processor is not None and model is not None,
        "endpoints": {
            "upload": "/upload",
            "analyze": "/analyze/{image_id}",
            "metadata": "/metadata/{image_id}",
        },
    }


@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload an image file and save it to the server"""
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # Generate unique filename
    file_extension = Path(file.filename).suffix.lower()
    if file_extension not in [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]:
        raise HTTPException(status_code=400, detail="Unsupported image format")

    unique_id = str(uuid.uuid4())
    filename = f"{unique_id}{file_extension}"
    file_path = Path("uploads") / filename

    try:
        # Save uploaded file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Extract metadata
        metadata = extract_image_metadata(str(file_path))

        # Generate AI description
        description = generate_image_description(str(file_path))

        return {
            "image_id": unique_id,
            "original_filename": file.filename,
            "saved_filename": filename,
            "file_path": str(file_path),
            "description": description,
            "metadata": metadata,
            "upload_time": datetime.now().isoformat(),
        }

    except Exception as e:
        # Clean up file if error occurs
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")


@app.get("/analyze/{image_id}")
async def analyze_image(image_id: str):
    """Get AI analysis for a previously uploaded image"""
    # Find image file
    uploads_dir = Path("uploads")
    image_files = list(uploads_dir.glob(f"{image_id}.*"))

    if not image_files:
        raise HTTPException(status_code=404, detail="Image not found")

    image_path = image_files[0]

    try:
        description = generate_image_description(str(image_path))
        metadata = extract_image_metadata(str(image_path))

        return {
            "image_id": image_id,
            "description": description,
            "metadata": metadata,
            "analysis_time": datetime.now().isoformat(),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")


@app.get("/metadata/{image_id}")
async def get_image_metadata(image_id: str):
    """Get metadata for a previously uploaded image"""
    # Find image file
    uploads_dir = Path("uploads")
    image_files = list(uploads_dir.glob(f"{image_id}.*"))

    if not image_files:
        raise HTTPException(status_code=404, detail="Image not found")

    image_path = image_files[0]

    try:
        metadata = extract_image_metadata(str(image_path))
        return {"image_id": image_id, "metadata": metadata}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error extracting metadata: {str(e)}"
        )


@app.get("/images")
async def list_images():
    """List all uploaded images"""
    uploads_dir = Path("uploads")
    if not uploads_dir.exists():
        return {"images": []}

    images = []
    for image_file in uploads_dir.glob("*"):
        if image_file.is_file():
            image_id = image_file.stem
            images.append(
                {
                    "image_id": image_id,
                    "filename": image_file.name,
                    "size": image_file.stat().st_size,
                    "created": datetime.fromtimestamp(
                        image_file.stat().st_ctime
                    ).isoformat(),
                }
            )

    return {"images": images}


@app.get("/uploads/{image_id}")
async def serve_image(image_id: str):
    """Serve an uploaded image file"""
    uploads_dir = Path("uploads")
    image_files = list(uploads_dir.glob(f"{image_id}.*"))

    if not image_files:
        raise HTTPException(status_code=404, detail="Image not found")

    image_path = image_files[0]

    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image file not found")

    return FileResponse(
        path=str(image_path),
        media_type=f"image/{image_path.suffix[1:]}",
        filename=image_path.name,
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=4444, reload=True)

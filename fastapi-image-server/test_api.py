#!/usr/bin/env python3
"""
Test script for the Image Analysis API
Demonstrates uploading an image and getting analysis results
"""

import requests
import json
from PIL import Image
import io
import os

API_BASE = "http://localhost:8000"


def create_test_image():
    """Create a simple test image"""
    # Create a simple colored image
    img = Image.new("RGB", (400, 300), color="lightblue")

    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="JPEG")
    img_bytes.seek(0)

    return img_bytes


def test_health_check():
    """Test the health check endpoint"""
    print("🔍 Testing health check...")
    response = requests.get(f"{API_BASE}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print()


def test_image_upload():
    """Test image upload with analysis"""
    print("📤 Testing image upload...")

    # Create test image
    test_image = create_test_image()

    # Upload image
    files = {"file": ("test_image.jpg", test_image, "image/jpeg")}
    response = requests.post(f"{API_BASE}/upload", files=files)

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Upload successful!")
        print(f"Image ID: {result['image_id']}")
        print(f"Description: {result['description']}")
        print(f"File size: {result['metadata']['file_size']} bytes")
        print(
            f"Dimensions: {result['metadata']['size']['width']}x{result['metadata']['size']['height']}"
        )
        return result["image_id"]
    else:
        print(f"❌ Upload failed: {response.text}")
        return None
    print()


def test_image_analysis(image_id):
    """Test image analysis endpoint"""
    if not image_id:
        return

    print(f"🧠 Testing image analysis for ID: {image_id}")
    response = requests.get(f"{API_BASE}/analyze/{image_id}")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Analysis successful!")
        print(f"Description: {result['description']}")
    else:
        print(f"❌ Analysis failed: {response.text}")
    print()


def test_metadata_extraction(image_id):
    """Test metadata extraction endpoint"""
    if not image_id:
        return

    print(f"📊 Testing metadata extraction for ID: {image_id}")
    response = requests.get(f"{API_BASE}/metadata/{image_id}")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Metadata extraction successful!")
        metadata = result["metadata"]
        print(f"Format: {metadata['format']}")
        print(f"Mode: {metadata['mode']}")
        print(f"Size: {metadata['size']}")
        if metadata["exif"]:
            print(f"EXIF data: {len(metadata['exif'])} entries")
    else:
        print(f"❌ Metadata extraction failed: {response.text}")
    print()


def test_list_images():
    """Test listing all images"""
    print("📋 Testing image listing...")
    response = requests.get(f"{API_BASE}/images")

    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Image listing successful!")
        print(f"Total images: {len(result['images'])}")
        for img in result["images"][:3]:  # Show first 3
            print(f"  - {img['filename']} ({img['size']} bytes)")
    else:
        print(f"❌ Image listing failed: {response.text}")
    print()


def main():
    """Run all tests"""
    print("🚀 Starting API tests...")
    print("=" * 50)

    try:
        # Test health check
        test_health_check()

        # Test image upload
        image_id = test_image_upload()

        # Test analysis
        test_image_analysis(image_id)

        # Test metadata
        test_metadata_extraction(image_id)

        # Test listing
        test_list_images()

        print("✅ All tests completed!")

    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to API server.")
        print("Make sure the server is running: uv run python main.py")
    except Exception as e:
        print(f"❌ Test failed with error: {e}")


if __name__ == "__main__":
    main()

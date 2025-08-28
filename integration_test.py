#!/usr/bin/env python3
"""
Integration test script for the Next.js webapp + FastAPI server
This script demonstrates the complete upload workflow
"""

import requests
import json
from PIL import Image
import io
import webbrowser
import time


def create_test_image_with_content():
    """Create a test image with recognizable content"""
    # Create an image with some recognizable elements
    from PIL import Image, ImageDraw, ImageFont

    img = Image.new("RGB", (600, 400), color="skyblue")
    draw = ImageDraw.Draw(img)

    # Draw a simple house
    # House base
    draw.rectangle([200, 250, 400, 350], fill="#8B4513", outline="black", width=2)
    # Roof
    draw.polygon(
        [(180, 250), (300, 180), (420, 250)], fill="red", outline="black", width=2
    )
    # Door
    draw.rectangle([280, 300, 320, 350], fill="#654321", outline="black", width=1)
    # Window
    draw.rectangle([230, 270, 270, 310], fill="#ADD8E6", outline="black", width=1)

    # Add some text
    try:
        # Try to use a built-in font
        font = ImageFont.load_default()
        draw.text((50, 50), "Test House Image", fill="black", font=font)
        draw.text((50, 80), "AI should describe this!", fill="black", font=font)
    except:
        # Fallback if font loading fails
        draw.text((50, 50), "Test House Image", fill="black")

    # Convert to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="JPEG")
    img_bytes.seek(0)

    return img_bytes


def test_fastapi_upload():
    """Test uploading to FastAPI directly"""
    print("🧪 Testing FastAPI upload endpoint...")

    # Create test image
    test_image = create_test_image_with_content()

    # Upload to FastAPI
    files = {"file": ("house_test.jpg", test_image, "image/jpeg")}
    response = requests.post("http://localhost:8000/upload", files=files)

    if response.status_code == 200:
        result = response.json()
        print(f"✅ FastAPI upload successful!")
        print(f"   Image ID: {result['image_id']}")
        print(f"   AI Description: {result['description']}")
        print(f"   File size: {result['metadata']['file_size']} bytes")

        # Test image serving
        image_url = f"http://localhost:8000/uploads/{result['image_id']}"
        img_response = requests.get(image_url)

        if img_response.status_code == 200:
            print(f"✅ Image serving works: {image_url}")
        else:
            print(f"❌ Image serving failed: {img_response.status_code}")

        return result["image_id"]
    else:
        print(f"❌ FastAPI upload failed: {response.status_code}")
        print(f"   Error: {response.text}")
        return None


def test_nextjs_webapp():
    """Test if Next.js webapp is accessible"""
    print("\n🌐 Testing Next.js webapp...")

    try:
        response = requests.get("http://localhost:3000/")
        if response.status_code == 200:
            print("✅ Next.js webapp is accessible at http://localhost:3000")
            return True
        else:
            print(f"❌ Next.js webapp returned: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Next.js webapp is not running")
        print("   Start it with: cd demo-webapp && npm run dev")
        return False


def create_demo_upload_url(image_id, original_name, description, metadata, upload_time):
    """Create a demo URL that shows how the webapp would display the upload"""
    from urllib.parse import urlencode

    params = {
        "imageId": image_id,
        "originalName": original_name,
        "description": description,
        "metadata": json.dumps(metadata),
        "uploadTime": upload_time,
    }

    return f"http://localhost:3000/upload?{urlencode(params)}"


def main():
    """Run the integration test"""
    print("🚀 Starting integration test...")
    print("=" * 60)

    # Test FastAPI
    image_id = test_fastapi_upload()

    # Test Next.js
    webapp_running = test_nextjs_webapp()

    print("\n📊 Integration Test Results:")
    print("=" * 60)

    if image_id and webapp_running:
        print("✅ Full integration working!")
        print("\n🎯 To test the complete workflow:")
        print("1. Open http://localhost:3000 in your browser")
        print("2. Click 'Upload an image' button")
        print("3. Select any image file")
        print("4. See AI description and metadata!")

        # Get the upload result to show what the URL would look like
        analysis_response = requests.get(f"http://localhost:8000/analyze/{image_id}")
        if analysis_response.status_code == 200:
            result = analysis_response.json()
            demo_url = create_demo_upload_url(
                image_id,
                "house_test.jpg",
                result["description"],
                result["metadata"],
                result["analysis_time"],
            )
            print(f"\n🔗 Demo upload result URL:")
            print(f"   {demo_url}")

            # Optionally open browser
            try:
                print(f"\n🌐 Opening demo in browser...")
                webbrowser.open(demo_url)
            except:
                print("   (Could not auto-open browser)")

    else:
        print("❌ Integration test failed!")
        if not image_id:
            print("   - FastAPI server not working")
        if not webapp_running:
            print("   - Next.js webapp not running")

    print("\n📋 Service Status:")
    print(f"   FastAPI (http://localhost:8000): {'✅' if image_id else '❌'}")
    print(f"   Next.js (http://localhost:3000): {'✅' if webapp_running else '❌'}")


if __name__ == "__main__":
    main()

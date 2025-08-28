'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

function formatBytes(bytes: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export default function UploadDetailsPage() {
  const params = useSearchParams();
  const imageId = params.get('imageId') || '';
  const originalName = params.get('originalName') || '';
  const description = params.get('description') || '';
  const uploadTime = params.get('uploadTime') || '';

  const [metadata, setMetadata] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Parse metadata from URL params
    const metadataStr = params.get('metadata');
    if (metadataStr) {
      try {
        setMetadata(JSON.parse(metadataStr));
      } catch (error) {
        console.error('Error parsing metadata:', error);
      }
    }

    // Set image URL to display from FastAPI server
    if (imageId) {
      // For demo purposes, we'll use a placeholder since we can't easily serve images from FastAPI
      // In a real app, you'd add an endpoint to serve uploaded images
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      setImageUrl(`${apiBaseUrl}/uploads/${imageId}`);
    }
  }, [params, imageId]);

  if (!metadata) {
    return (
      <section className="grid place-items-center min-h-[400px]">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">Loading image data...</h1>
          <p className="text-default-600">
            Please wait while we process your upload.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="relative w-full rounded-xl overflow-hidden bg-content1 aspect-[4/3]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={originalName}
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-contain"
              unoptimized
              onError={() => {
                // Fallback if image can't be loaded
                setImageUrl('');
              }}
            />
          ) : (
            <div className="grid absolute inset-0 place-items-center text-default-500">
              <div className="text-center">
                <p>Image preview not available</p>
                <p className="mt-1 text-sm">File uploaded successfully</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <aside className="space-y-4 lg:col-span-1">
        <h1 className="text-3xl font-semibold">Uploaded Image</h1>

        <div className="p-4 rounded-xl border border-default-200 bg-content1">
          <h3 className="font-medium">Metadata</h3>
          <ul className="mt-2 space-y-1 text-sm text-default-700">
            <li>
              <span className="text-default-500">Name:</span> {originalName}
            </li>
            <li>
              <span className="text-default-500">Type:</span>{' '}
              {metadata.format || 'Unknown'}
            </li>
            <li>
              <span className="text-default-500">Size:</span>{' '}
              {formatBytes(metadata.file_size || 0)}
            </li>
            <li>
              <span className="text-default-500">Dimensions:</span>{' '}
              {metadata.size
                ? `${metadata.size.width}x${metadata.size.height}`
                : 'Unknown'}
            </li>
            <li>
              <span className="text-default-500">Upload Time:</span>{' '}
              {uploadTime ? new Date(uploadTime).toLocaleString() : '-'}
            </li>
          </ul>
        </div>

        <div className="p-4 rounded-xl border border-default-200 bg-content1">
          <h3 className="font-medium">AI Description</h3>
          <p className="mt-1 text-sm text-default-700">
            {description || 'No description available'}
          </p>
        </div>

        {metadata.exif && Object.keys(metadata.exif).length > 0 && (
          <div className="p-4 rounded-xl border border-default-200 bg-content1">
            <h3 className="font-medium">EXIF Data</h3>
            <div className="mt-2 text-sm text-default-700">
              <p>{Object.keys(metadata.exif).length} EXIF entries found</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-primary">
                  View Details
                </summary>
                <ul className="overflow-y-auto mt-2 space-y-1 max-h-32">
                  {Object.entries(metadata.exif)
                    .slice(0, 10)
                    .map(([key, value]) => (
                      <li key={key} className="text-xs">
                        <span className="text-default-500">{key}:</span>{' '}
                        {String(value).slice(0, 50)}
                      </li>
                    ))}
                </ul>
              </details>
            </div>
          </div>
        )}
      </aside>
    </section>
  );
}

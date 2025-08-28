'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@heroui/button';
import type { AnimalKey } from '@/lib/animals';

interface UploadResult {
  image_id: string;
  description: string;
  original_filename: string;
  upload_time: string;
  metadata: {
    file_size: number;
    size: {
      width: number;
      height: number;
    };
    format: string;
  };
}

interface StatusState {
  message: string;
  isError: boolean;
  isVisible: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<StatusState>({
    message: '',
    isError: false,
    isVisible: false,
  });
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  const setStatusMessage = (message: string, isError = false) => {
    setStatus({
      message,
      isError,
      isVisible: true,
    });
  };

  const clearStatus = () => {
    setStatus({
      message: '',
      isError: false,
      isVisible: false,
    });
  };

  const testApiConnectivity = async () => {
    try {
      console.log('Testing API connectivity...');
      const response = await fetch(`${API_BASE}/`);
      if (response.ok) {
        const data = await response.json();
        console.log('API is accessible:', data);
        setStatusMessage(`API is running: ${data.message}`);
        setApiConnected(true);
      } else {
        console.error('API not accessible:', response.status);
        setStatusMessage('API is not accessible', true);
        setApiConnected(false);
      }
    } catch (error) {
      console.error('API connection error:', error);
      setStatusMessage(
        `API connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        true
      );
      setApiConnected(false);
    }
  };

  useEffect(() => {
    testApiConnectivity();
  }, []);

  const onPickAnimal = (animal: AnimalKey) => {
    router.push(`/animals/${animal}`);
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setStatusMessage('Please select a file first', true);
      return;
    }

    console.log('Selected file:', file.name, file.size, file.type);
    setIsUploading(true);
    setUploadResult(null);
    setStatusMessage('Uploading file...');

    try {
      // Create FormData to send to FastAPI
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending upload request to:', `${API_BASE}/upload`);

      // Upload to FastAPI server
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log(
        'Response headers:',
        Object.fromEntries(response.headers.entries())
      );

      if (response.ok) {
        const result = await response.json();
        console.log('Upload result:', result);
        setStatusMessage('Upload completed successfully!');
        setUploadResult(result);
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        setStatusMessage(
          `Upload failed: ${response.status} - ${errorText}`,
          true
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage(`Upload error: ${errorMessage}`, true);
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };

  return (
    <section className="flex flex-col gap-6 py-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Animal Gallery Demo</h1>
        <p className="mt-2 text-default-600">
          Choose an animal or upload an image.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {(['cat', 'dog', 'elephant'] as AnimalKey[]).map((animal) => (
          <button
            key={animal}
            onClick={() => onPickAnimal(animal)}
            className="relative p-6 text-left rounded-2xl border transition-colors group border-default-200 hover:border-primary/60 bg-content1"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold capitalize">{animal}</h3>
                <p className="mt-1 text-default-600">Tap to know more</p>
              </div>
              <span className="grid place-items-center w-10 h-10 font-bold rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary">
                {animal[0].toUpperCase()}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center my-8">
        <hr className="flex-grow border-t border-default-300" />
        <span className="mx-4 font-medium text-default-500">OR</span>
        <hr className="flex-grow border-t border-default-300" />
      </div>
      <h2>
        NOTE: This feature uses{' '}
        <a
          href="https://huggingface.co/Salesforce/blip-image-captioning-base"
          target="_blank"
          rel="noreferrer"
        >
          <code className="inline-flex gap-1 items-center px-2 py-1 hover:text-primary">
            Salesforce/blip-image-captioning-base{' '}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m5-3h3m0 0v3m0-3L10 14"
              />
            </svg>
          </code>{' '}
        </a>
        for captioning. Accuracy might not be 100%.
      </h2>
      <div className="flex gap-3 items-center w-full">
        <label
          className={`${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'} w-full`}
        >
          {isUploading ? (
            <div className="flex justify-center items-center w-full h-32 rounded-md border-2 border-dashed border-primary bg-default-200">
              Uploading...
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              className="p-4 w-full h-32 rounded-md border-2 border-dashed border-primary bg-default-100"
              onChange={onFileChange}
              disabled={isUploading}
            />
          )}
        </label>
      </div>

      {/* Status Display */}
      {status.isVisible && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            status.isError
              ? 'bg-danger/10 border border-danger/20 text-danger'
              : 'bg-success/10 border border-success/20 text-success'
          }`}
        >
          <p>{status.message}</p>
        </div>
      )}

      {/* Upload Result Display */}
      {uploadResult && (
        <div className="p-6 mt-6 rounded-xl border bg-success/10 border-success/20">
          <h3 className="mb-4 text-xl font-semibold text-success">
            Upload Successful!
          </h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Image ID:</strong> {uploadResult.image_id}
            </p>
            <p>
              <strong>Description:</strong> {uploadResult.description}
            </p>
            <p>
              <strong>File Size:</strong>{' '}
              {uploadResult.metadata.file_size.toLocaleString()} bytes
            </p>
            <p>
              <strong>Dimensions:</strong> {uploadResult.metadata.size.width}x
              {uploadResult.metadata.size.height}
            </p>
            <p>
              <strong>Format:</strong> {uploadResult.metadata.format}
            </p>
          </div>
          <div className="mt-4">
            <img
              src={`${API_BASE}/uploads/${uploadResult.image_id}`}
              alt="Uploaded image"
              className="max-w-full h-auto rounded-lg border border-default-200"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                console.log('Image load failed');
              }}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onClick={() => {
                const params = new URLSearchParams({
                  imageId: uploadResult.image_id,
                  originalName: uploadResult.original_filename,
                  description: uploadResult.description,
                  metadata: JSON.stringify(uploadResult.metadata),
                  uploadTime: uploadResult.upload_time,
                });
                router.push(`/upload?${params.toString()}`);
              }}
            >
              View Details
            </Button>
            <Button
              size="sm"
              variant="flat"
              onClick={() => {
                setUploadResult(null);
                clearStatus();
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

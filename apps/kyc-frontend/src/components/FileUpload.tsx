
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileImage, X } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  uploadedFiles: File[];
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUpload, 
  uploadedFiles, 
  onSubmit, 
  isSubmitting 
}) => {
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a JPEG, PNG, or WebP image.');
      return false;
    }

    if (file.size > maxSize) {
      alert('Please upload an image smaller than 10MB.');
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((newFiles: FileList) => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < Math.min(newFiles.length, 2 - uploadedFiles.length); i++) {
      const file = newFiles[i];
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length > 0) {
      onFileUpload([...uploadedFiles, ...validFiles]);
    }
  }, [uploadedFiles, onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    onFileUpload(newFiles);
  };

  const canUploadMore = uploadedFiles.length < 2;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Document Upload
        </CardTitle>
        <CardDescription>
          Upload 1-2 passport or ID images (max 10MB each)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {canUploadMore && (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleChange}
              accept="image/*"
              multiple
              disabled={isSubmitting}
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-500" />
              </div>
              
              <div>
                <p className="text-gray-700 font-medium">
                  Drop images here, or click to browse
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Supports JPEG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Uploaded Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <FileImage className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{file.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  onClick={() => removeFile(index)}
                  variant="ghost"
                  size="sm"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <Button 
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </div>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

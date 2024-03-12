import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({ onImageUpload }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    try {
      const formData = new FormData();
      formData.append('image', file); // Match the key with the server

      const response = await fetch('/upload', { // Match the server endpoint
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error uploading image: ${response.statusText}`);
      }

      const result = await response.json();

      // Assuming your backend returns the URL of the uploaded image
      const imageUrl = result.imageUrl;
      onImageUpload(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/*',
  });

  return (
    <div {...getRootProps()} style={dropzoneStyles}>
      <input {...getInputProps()} />
      <p>Drag 'n' drop an image here, or click to select one</p>
    </div>
  );
};

const dropzoneStyles = {
  border: '2px dashed #cccccc',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
};

export default ImageUpload;

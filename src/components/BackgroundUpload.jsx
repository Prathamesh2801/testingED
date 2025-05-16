import React, { useState } from 'react';
import { Upload, X, Check, Image } from 'lucide-react';
import { uploadBackgroundImages } from '../utils/ClientData';
import toast from 'react-hot-toast';

export default function BackgroundUpload() {
  // State for storing uploaded files and their previews
  const eventId = localStorage.getItem('eventId')
  const [backgroundImages, setBackgroundImages] = useState({
    mobile: null,
    tablet: null,
    landscape: null
  });

  // Aspect ratios for different views
  const aspectRatios = {
    mobile: '9/16', // Portrait for mobile
    tablet: '3/4',  // Common tablet ratio
    landscape: '16/9' // Landscape view
  };

  // Handle file selection
  const handleFileChange = (event, viewType) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setBackgroundImages(prev => ({
          ...prev,
          [viewType]: {
            file,
            preview: e.target.result,
            name: file.name
          }
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  // Remove an uploaded image
  const removeImage = (viewType) => {
    setBackgroundImages(prev => ({
      ...prev,
      [viewType]: null
    }));
  };

  const allImagesUploaded = Object.values(backgroundImages).every(img => img !== null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await uploadBackgroundImages({
        eventID: eventId,
        img1: backgroundImages.mobile.file,
        img2: backgroundImages.tablet.file,
        img3: backgroundImages.landscape.file
      });
      console.log("Uploaded Response : ", response)
      toast.success("Background Image is Uploaded", { duration: 2000 })
    } catch (err) {
      console.log(err)
      toast.error("Background Image Failed to Upload", { duration: 2000 })
    }
  };


  return (
    <div className="bg-gray-100 min-h-screen ">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Background Image Upload</h1>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Mobile View Upload */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-semibold mb-2">Mobile View (Portrait)</h2>
              <p className="text-sm text-gray-500 mb-4">Aspect ratio {aspectRatios.mobile}</p>

              {!backgroundImages.mobile ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => document.getElementById('mobile-upload').click()}>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <input
                    type="file"
                    id="mobile-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'mobile')}
                  />
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden h-64">
                  <img
                    src={backgroundImages.mobile.preview}
                    alt="Mobile preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => removeImage('mobile')}
                      className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm truncate">
                    {backgroundImages.mobile.name}
                  </div>
                </div>
              )}
            </div>

            {/* Tablet View Upload */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-semibold mb-2">Tablet View</h2>
              <p className="text-sm text-gray-500 mb-4">Aspect ratio {aspectRatios.tablet}</p>

              {!backgroundImages.tablet ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => document.getElementById('tablet-upload').click()}>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <input
                    type="file"
                    id="tablet-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'tablet')}
                  />
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden h-64">
                  <img
                    src={backgroundImages.tablet.preview}
                    alt="Tablet preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => removeImage('tablet')}
                      className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm truncate">
                    {backgroundImages.tablet.name}
                  </div>
                </div>
              )}
            </div>

            {/* Landscape View Upload */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h2 className="text-lg font-semibold mb-2">Landscape View</h2>
              <p className="text-sm text-gray-500 mb-4">Aspect ratio {aspectRatios.landscape}</p>

              {!backgroundImages.landscape ? (
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => document.getElementById('landscape-upload').click()}>
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <input
                    type="file"
                    id="landscape-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'landscape')}
                  />
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden h-64">
                  <img
                    src={backgroundImages.landscape.preview}
                    alt="Landscape preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => removeImage('landscape')}
                      className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm truncate">
                    {backgroundImages.landscape.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Preview</h2>

            {!allImagesUploaded ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 flex items-center">
                <Image className="w-5 h-5 mr-2" />
                Please upload images for all three views to see the full preview.
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center text-green-800 mb-4">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">All images uploaded successfully!</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Mobile Preview</p>
                    <div className="mx-auto w-24 h-40 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={backgroundImages.mobile.preview}
                        alt="Mobile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Tablet Preview</p>
                    <div className="mx-auto w-36 h-40 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={backgroundImages.tablet.preview}
                        alt="Tablet preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Landscape Preview</p>
                    <div className="mx-auto w-60 h-36 rounded-lg overflow-hidden border border-gray-300">
                      <img
                        src={backgroundImages.landscape.preview}
                        alt="Landscape preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                disabled={!allImagesUploaded}
                className={`px-6 py-2 rounded-lg font-medium ${allImagesUploaded
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
              >
                Save Background Images
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
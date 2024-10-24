"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Select, MenuItem, IconButton,CircularProgress } from '@mui/material';
import { Search, Upload, X, Plus, CheckCircle, XCircle } from 'lucide-react';
import {
  createAlbum,
  getAllAlbums,
  uploadImageToAlbum,
  getImagesByQuery,
} from './albumApis';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedImages, setUploadedImages] = useState<{ id: number; title: string; imageUrl: string }[]>([]);
  const [activeTab, setActiveTab] = useState('gallery');
  interface Album {
    id: number;
    title: string;
    images: { id: number; title: string; imageUrl: string }[];
  }
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [images, setImages] = useState<{ id: number; title: string; imageUrl: string }[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const tripId =6;
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null); // null: no status, true: success, false: error
  const [errorMessage, setErrorMessage] = useState("");
  const fetchAlbums = async () => {
    try {
      const albumsData = await getAllAlbums();
      setAlbums(albumsData);
      if (albumsData.length > 0) setSelectedAlbumId(albumsData[0].id);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };
  // Fetch albums once when the component mounts
  useEffect(() => {
    
    fetchAlbums();
  }, []);

  // Fetch images based on search query
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const allImages = await getImagesByQuery(searchQuery);
        setImages(allImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [searchQuery]);

  // Handle search input change
  const handleSearch = useCallback((query: React.SetStateAction<string>) => {
    setSearchQuery(query);
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploading(true);
    setUploadSuccess(null);
    setErrorMessage("");

    try {
      // Simulate image upload process (replace this with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const uploadedImage = await uploadImageToAlbum(selectedAlbumId, file, { title: file.name },tripId);

      // If upload is successful
      setUploadSuccess(true);
    } catch (error) {
      // If there's an error during upload
      setUploadSuccess(false);
      setErrorMessage("Failed to upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
    fetchAlbums();
  };

  // Handle creating a new album
  const handleCreateAlbum = async () => {
    try {
      const newAlbum = await createAlbum({ title: 'New Album', description: 'Description' });
      setAlbums((prevAlbums) => [...prevAlbums, newAlbum]);
      setSelectedAlbumId(newAlbum.id);
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  // Combine uploaded images with fetched images
  const filteredImages = useMemo(() => {
    return [...images, ...uploadedImages].filter(
      (image) => image.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [images, uploadedImages, searchQuery]);

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-gray-50 p-4 sm:p-6 lg:p-8 rounded-sm">
      {/* Header */}
      <h1 className="text-3xl sm:text-2xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
        <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">Travel Memories</span>
      </h1>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 sm:mb-8 bg-white rounded-xl p-1.5 shadow-sm w-fit mx-auto">
        {['gallery', 'upload'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 ${
              activeTab === tab 
                ? 'bg-orange-500 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-orange-50'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'gallery' ? (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          {/* Album Dropdown */}
          <div className="flex flex-row items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-orange-500">Albums</h2>
            <Select
              value={selectedAlbumId || ""}
              onChange={(e) => setSelectedAlbumId(Number(e.target.value))}
              className=""
              size="small"
            >
              {albums.map((album) => (
                <MenuItem key={album.id} value={album.id}>
                  {album.title}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your memories..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Group images by album */}
          {albums.map((album) => {
            const albumImages = album.images;
            return (
              albumImages && albumImages.length > 0 && (
                <div key={album.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-orange-600 mb-4">{album.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {albumImages.map((image) => (
                      <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                        <img
                          src={"http://localhost:3000" + image.imageUrl}
                          alt={image.title}
                          className="w-full h-40 sm:h-48 lg:h-56 object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white text-sm sm:text-base font-medium">{image.title}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Upload Section */}
        <div className="max-w-xl mx-auto">
          <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 sm:p-8 text-center hover:border-orange-400 transition-colors bg-orange-50/50">
            {/* Icon or Progress Spinner */}
            {uploading ? (
              <CircularProgress className="mx-auto text-orange-400" />
            ) : uploadSuccess === true ? (
              <CheckCircle className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-green-500" />
            ) : uploadSuccess === false ? (
              <XCircle className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-red-500" />
            ) : (
              <Upload className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-orange-400" />
            )}
  
            {/* Title and Instructions */}
            <h3 className="mt-4 text-base sm:text-lg font-medium text-gray-900">
              {uploadSuccess === true
                ? "Image uploaded successfully!"
                : uploadSuccess === false
                ? "Upload failed"
                : "Drop your images here"}
            </h3>
  
            {/* Error message */}
            {uploadSuccess === false && (
              <p className="mt-2 text-xs sm:text-sm text-red-500">{errorMessage}</p>
            )}
  
            {/* Upload Button and Input */}
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              or click to browse
            </p>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <Button
              onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
              className="mt-4 inline-block px-5 py-2 rounded-lg text-sm sm:text-base font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Page;

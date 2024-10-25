'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Select, MenuItem, IconButton, CircularProgress } from '@mui/material';
import { Search, Upload, CheckCircle, XCircle } from 'lucide-react';
import { createAlbum, getAllAlbums, uploadImageToAlbum, getImagesByQuery } from './albumApis';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedImages, setUploadedImages] = useState<{ id: number; title: string; imageUrl: string }[]>([]);
  const [activeTab, setActiveTab] = useState('gallery');
  const [albums, setAlbums] = useState([]);
  const [images, setImages] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const tripId = 6;

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
        if (searchQuery) {
          const searchResponse = await getImagesByQuery(searchQuery);
          setSearchResults(searchResponse.results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [searchQuery]);

  // Handle search input change
  const handleSearch = useCallback(async (query: string) => {
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
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await uploadImageToAlbum(selectedAlbumId, file, { title: file.name }, tripId);
      setUploadSuccess(true);
    } catch (error) {
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

  // Conditionally display search results or album images
  const displayedImages = searchQuery ? searchResults : uploadedImages;

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-50 to-gray-50 p-4 sm:p-6 lg:p-8 rounded-sm">
      <h1 className="text-3xl sm:text-2xl lg:text-4xl font-bold text-center text-gray-900 mb-6 sm:mb-8 lg:mb-12">
        <span className="bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
          Travel Memories
        </span>
      </h1>

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
          <div className="flex flex-row items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-gray-500">Albums</h2>
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

          <div className="flex flex-col gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-5 w-5" />
              <input
                type="text"
                placeholder="Search your memories..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {searchQuery ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {searchResults.map((image) => (
                <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <img
                    src={`http://localhost:3000${image.imageUrl}`}
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
          ) : (
            albums.map((album) => (
              <div key={album.id} className="mb-8">
                <h2 className="text-2xl font-bold text-orange-600 mb-4">{album.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {album.images.map((image) => (
                    <div key={image.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                      <img
                        src={`http://localhost:3000${image.imageUrl}`}
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
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
          <div className="max-w-xl mx-auto">
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 sm:p-8">
              {uploading ? (
                <div className="flex justify-center items-center">
                  <CircularProgress size={30} className="text-orange-500" />
                </div>
              ) : (
                <>
                  <label className="flex flex-col items-center justify-center h-40 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-all">
                    <Upload className="h-10 w-10 text-orange-400" />
                    <p className="text-gray-500 mt-2">Click to upload an image</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {uploadSuccess && (
                    <div className="mt-4 flex items-center text-green-500">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Image uploaded successfully!
                    </div>
                  )}

                  {uploadSuccess === false && (
                    <div className="mt-4 flex items-center text-red-500">
                      <XCircle className="mr-2 h-5 w-5" />
                      {errorMessage}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Loader2, Upload, Plus } from "lucide-react";
import Link from "next/link";

interface Album {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const AlbumUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Albums on Component Mount
  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/album", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch albums");

        const data: Album[] = await response.json();
        setAlbums(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch albums");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  const createAlbum = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/album", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) throw new Error("Failed to create album");

      const album = await response.json();
      setAlbums((prev) => [...prev, album]); // Add new album to the list
      setCurrentAlbum(album);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create album");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImages = async (e: FormEvent) => {
    e.preventDefault();
    if (files.length === 0 || !currentAlbum) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));

      const response = await fetch(
        `http://localhost:3000/api/album/${currentAlbum.id}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to upload images");
      }

      setFiles([]);
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      alert("Images uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Album Creation Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-black">Create New Album</h2>
        <form onSubmit={createAlbum} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              <Plus className="-ml-1 mr-2 h-5 w-5" />
            )}
            Create Album
          </button>
        </form>
      </div>

      {/* Album List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Albums</h2>
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <ul>
            {albums.map((album) => (
             <Link href={`/dashboard/photos2/${album.id}`}>
                 <li key={album.id} className="py-2">
                <p className="font-semibold">{album.title}</p>
                <p className="text-sm text-gray-600">{album.description}</p>
              </li>
             </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Image Upload Form */}
      {currentAlbum && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Upload Images to {currentAlbum.title}
          </h2>
          <form onSubmit={uploadImages} className="space-y-4">
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700"
              >
                Choose Images
              </label>
              <input
                type="file"
                id="images"
                onChange={handleFileChange}
                multiple
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || files.length === 0}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
              ) : (
                <Upload className="-ml-1 mr-2 h-5 w-5" />
              )}
              Upload Images ({files.length} selected)
            </button>
          </form>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AlbumUpload;

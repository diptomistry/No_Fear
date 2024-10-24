import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/albums';
const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyOTc4NjY3MSwiZXhwIjoxNzI5NzkwMjcxfQ.TeQK070Wx-1QfGOeidezPH5UPaD0fds4UF5XnUSmfgw";

// Create a new album
export const createAlbum = async (albumData: { title: string; description: string; TripId?: any; }) => {
  console.log('Creating album...');
  console.log('albumData:', albumData);
  try {
    const response = await axios.post(API_BASE_URL, albumData, {
      headers: { Authorization: token }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating album:', error);
    throw error;
  }
};

// Get all albums
export const getAllAlbums = async () => {
  try {
    const response = await axios.get(API_BASE_URL, { headers: { Authorization: token } });
    console.log('response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};

// Get all albums by trip ID
export const getAlbumsByTripId = async (tripId: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/trip/${tripId}`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    console.error('Error fetching albums by trip ID:', error);
    throw error;
  }
};

// Get a single album by ID
export const getAlbumById = async (id: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    console.error('Error fetching album by ID:', error);
    throw error;
  }
};

// Update an album by ID
export const updateAlbum = async (id: any, albumData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, albumData, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    console.error('Error updating album:', error);
    throw error;
  }
};

// Delete an album by ID
export const deleteAlbum = async (id: any) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    console.error('Error deleting album:', error);
    throw error;
  }
};

// Upload image to album
export const uploadImageToAlbum = async (albumId: string | number | null, imageFile: string | Blob, additionalData: { [x: string]: string | Blob; title: string | Blob; }, tripId: number) => {
  try {
    console.log('Uploading image to album...');
    console.log('albumId:', albumId);
    console.log('tripId:', tripId);
    if (albumId === 'all') {
      // Create a new album
      const newAlbum = await createAlbum({ title: 'New Album', description: 'Description', TripId: tripId });
      albumId = newAlbum.id;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    const response = await axios.post(`${API_BASE_URL}/${albumId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image to album:', error);
    throw error;
  }
};

// Get all images by query
export const getImagesByQuery = async (query: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/images?query=${query}`, { headers: { Authorization: token } });
    return response.data;
  } catch (error) {
    console.error('Error fetching images by query:', error);
    throw error;
  }
};
//vxenJiY4KDrHomRG6ciaVEVh4JiSUDjucRiGMeV6
"use client";
// pages/page.tsx
import React, { useState } from 'react';
import axios from 'axios';

const VideoGenerator = () => {
  const [images, setImages] = useState<File[]>([]);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages(Array.from(event.target.files));
    }
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setStatus(null);

    // Prepare the image URLs (these should be publicly accessible URLs)
    const imageUrls = images.map((image) => URL.createObjectURL(image));

    // Construct the payload without a soundtrack
    const payload = {
      timeline: {
        tracks: imageUrls.map((url, index) => ({
          clips: [{
            asset: {
              type: "image",
              src: url,
            },
            start: index * 5,
            length: 5,
            effect: "zoomIn",
            transition: {
              in: "fade",
              out: "fade",
            },
          }],
        })),
      },
      output: {
        format: "mp4",
        resolution: "sd",
      },
    };

    try {
      const response = await axios.post('https://api.shotstack.io/stage/render', payload, {
        headers: {
          'x-api-key': 'vxenJiY4KDrHomRG6ciaVEVh4JiSUDjucRiGMeV6', // Replace with your API key
        },
      });

      setRenderId(response.data.response.id);
      checkRenderStatus(response.data.response.id);
    } catch (error) {
      console.error('Error creating video:', error);
      setStatus('Error creating video');
    } finally {
      setLoading(false);
    }
  };

  const checkRenderStatus = async (renderId: string) => {
    try {
      const response = await axios.get(`https://api.shotstack.io/stage/render/${renderId}`, {
        headers: {
          'x-api-key': 'vxenJiY4KDrHomRG6ciaVEVh4JiSUDjucRiGMeV6', // Replace with your API key
        },
      });

      setStatus(response.data.response.status);
    } catch (error) {
      console.error('Error fetching render status:', error);
      setStatus('Error fetching status');
    }
  };

  return (
    <div className="container">
      <h1>Generate Video</h1>
      <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleGenerateVideo} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      {renderId && <p>Render ID: {renderId}</p>}
      {status && <p>Render Status: {status}</p>}
    </div>
  );
};

export default VideoGenerator;

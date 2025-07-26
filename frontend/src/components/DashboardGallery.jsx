import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';

const ImageGallery = () => {
  const [images, setImages] = useState([]);
const apiUrl = `${import.meta.env.VITE_API_URL}/api`;

 useEffect(() => {
  const token = localStorage.getItem(ACCESS_TOKEN); // lub sessionStorage

  axios.get(`${apiUrl}/generate/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then(res => setImages(res.data))
  .catch(err => console.error('Błąd podczas pobierania obrazów:', err));
}, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-2">Gallery</h1>
      <p className="text-gray-500 mb-4 max-w-xl">Browse through your generated images below.</p>

      {/* Scrollable image container */}
      <div className="h-[80vh] overflow-y-auto rounded-md border border-gray-200 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden">
              <img
                src={img.url}
                alt={`Generated image ${index + 1}`}
                className="w-full h-44 object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/50 text-white flex items-end p-2 opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm">Prompt: {img.prompt.slice(0, 30)}...</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;

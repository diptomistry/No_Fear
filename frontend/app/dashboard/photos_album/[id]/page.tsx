'use client'
import { useParams } from 'next/navigation'
import React, { useState, useEffect, use } from 'react'

const Page = () => {
    const { id } = useParams();
    const [query, setQuery] = useState('');
    const [data, setData] = useState(null);
    const [photos, setPhotos] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/album`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();

                
                console.log(result[0].images);

                const res = result[0].images.map((image: any) => {
                    return {
                        id: image.id,
                        imageUrl: `http://localhost:3000${image.imageUrl}`,
                    }
                });
                
                
                
                setPhotos(res);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    },[]);

    const fetchData = async (searchQuery: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/album/query/${id}?query=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            const res = result.results.map((image: any) => {
                return {
                    id: image.id,
                    imageUrl: `http://localhost:3000${image.imageUrl}`,
                }
            });
            console.log("res");
                
            console.log(res);
            setData(result);
            setPhotos(res);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchData(query);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Search query"
                />
                <button type="submit">Search</button>
            </form>
            <div>
                {data ? JSON.stringify(data) : 'No data'}
            </div>

            <section>
                <h2>Photos</h2>
                {photos && (
                    <ul>
                        {photos.map((photo) => (
                            <li key={photo.id}>
                                <img src={photo.imageUrl} alt={photo.id} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default Page
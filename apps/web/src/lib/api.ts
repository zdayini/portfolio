const API_URL = 'http://localhost:3000';

export type Concert = {
    id: number;
    artist: string;
    venue: string;
    city: string;
    country: string;
    date: string;
    rating: number | null;
    title: string;
    is_public: boolean;
    created_at: string;

};

export async function getConcerts(): Promise<Concert[]> {
    const res = await fetch(`${API_URL}/concerts`);
    if (!res.ok) throw new Error('Failed to fetch concerts');
    return res.json();
}

export type Photo = {
    id: number;
    concert_id: number;
    url: string;
    sort_order: number;
};

export async function getAllPhotos(): Promise<Photo[]> {
    const res = await fetch(`${API_URL}/concerts/photos`);
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
}
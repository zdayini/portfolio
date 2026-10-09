const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function authHeaders(): Record<string, string> {
    const token = localStorage.getItem('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

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

export async function getConcert(id: number): Promise<Concert> {
    const res = await fetch(`${API_URL}/concerts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch concert');
    return res.json();
}

export async function getConcertPhotos(id: number): Promise<Photo[]> {
    const res = await fetch(`${API_URL}/concerts/photos/${id}`);
    if (!res.ok) throw new Error('Failed to fetch photos');
    return res.json();
}

export type NewConcert = {
    artist: string;
    venue: string;
    city: string;
    country: string;
    date: string;
    rating?: number;
    title?: string;
};

export async function createConcert(data: NewConcert) {
    const res = await fetch(`${API_URL}/concerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),

    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create concert');
    }
    return res.json();
}

export async function updateConcert(id: number, data: Partial<NewConcert>) {
    const res = await fetch(`${API_URL}/concerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update concert');
    return res.json();
}

export async function deleteConcert(id: number) {
    const res = await fetch(`${API_URL}/concerts/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error('Failed to delete concert');
    return res.json();
}

export async function uploadPhoto(concertId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/concerts/${concertId}/photos`, {
        method: 'POST',
        headers: { ...authHeaders() },
        body: formData,
    });
    if (!res.ok) throw new Error('Failed to upload photo');
    return res.json();
}

export async function deletePhoto(photoId: number) {
    const res = await fetch(`${API_URL}/concerts/photos/${photoId}`, {
        method: 'DELETE',
        headers: { ...authHeaders() },
    });
    if (!res.ok) throw new Error('Failed to delete photo');
    return res.json();
}

export async function login(password: string): Promise<string> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error('Wrong password');
    const { token } = await res.json();
    return token;
}


import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getConcert, getConcertPhotos } from '../lib/api';

function ConcertDetail() {
    const { id } = useParams();
    const concertId = Number(id);

    const { data: concert, isLoading: loadingConcert } = useQuery({
        queryKey: ['concert', concertId],
        queryFn: () => getConcert(concertId),
    });

    const { data: photos, isLoading: loadingPhotos } = useQuery({
        queryKey: ['concertPhotos', concertId],
        queryFn: () => getConcertPhotos(concertId),
    });

    if (loadingConcert || loadingPhotos) return <p>Loading...</p>;
    if (!concert) return <p>Concert not found.</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
            <Link to="/">&larr; Back</Link>
            <h1>{concert.artist}</h1>
            <p>{concert.venue}, {concert.city}</p>
            <p>{concert.date}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                {photos?.map((photo) => (
                    <img
                        key={photo.id}
                        src={photo.url}
                        alt={concert.artist}
                        style={{ width: '100%', borderRadius: 8, objectFit: 'cover', aspectRatio: '1' }}
                    />
                ))}
            </div>

            {photos?.length === 0 && <p>No photos yet.</p>}
        </div>
    );
}

export default ConcertDetail;
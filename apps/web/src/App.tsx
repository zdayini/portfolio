import { useQuery } from '@tanstack/react-query';
import { getConcerts, getAllPhotos } from './lib/api';
import { TicketCard } from './components/TicketCard';
import './components/TicketCard.css';
import { Link } from 'react-router-dom';

function App() {
  const { data: concerts, isLoading: loadingConcerts } = useQuery({
    queryKey: ['concerts'],
    queryFn: getConcerts,
  });

  const { data: photos, isLoading: loadingPhotos } = useQuery({
    queryKey: ['photos'],
    queryFn: getAllPhotos,
  });

  if (loadingConcerts || loadingPhotos) return <p>Loading...</p>;

  // Build a lookup: concert_id -> first photo url
  const photoByConcert = new Map<number, string>();
  photos?.forEach((photo) => {
    if (!photoByConcert.has(photo.concert_id)) {
      photoByConcert.set(photo.concert_id, photo.url);
    }
  });

  return (
    <div className="ticket-grid">
      {concerts?.map((concert) => (
        <Link
          key={concert.id}
          to={`/concerts/${concert.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <TicketCard
            key={concert.id}
            artist={concert.artist}
            venue={concert.venue}
            city={concert.city}
            date={concert.date}
            rating={concert.rating}
            title={concert.title}
            photo_url={photoByConcert.get(concert.id)}
          />
        </Link>
      ))}
    </div>
  );
}


export default App;
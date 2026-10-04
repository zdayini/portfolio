type TicketCardProps = {
    artist: string;
    venue: string;
    city: string;
    date: string;
    rating: number | null;
    title: string;
    photo_url?: string;
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export function TicketCard({ artist, venue, city, date, rating, title, photo_url }: TicketCardProps) {
    return (
        <div
            className="ticket-card"
            style={{ backgroundImage: photo_url ? `url(${photo_url})` : undefined }}
        >
            <div className="ticket-card__overlay">
                <p className="ticket-card__label">{title}</p>
                <h2 className="ticket-card__artist">{artist}</h2>
                {/* Grouped footer layout elements to prevent overlap */}
                <div className="ticket-card__footer">
                    <p className="ticket-card__date">{formatDate(date)}</p>
                    <p className="ticket-card__venue">{venue}, {city}</p>
                </div>
            </div>
            <div className="ticket-card__stub">
                {rating ? <span>★ {rating}</span> : null}
            </div>
        </div>

    )
}

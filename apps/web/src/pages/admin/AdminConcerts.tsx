import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getConcerts, deleteConcert } from '../../lib/api';

function AdminConcerts() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: concerts, isLoading } = useQuery({
        queryKey: ['concerts'],
        queryFn: getConcerts,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteConcert,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['concerts'] });
        },
    });

    if (isLoading) return <p>Loading...</p>;

    return (
        <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
            <button
                onClick={() => {
                    localStorage.removeItem('admin_token');
                    navigate('/admin/login');
                }}
                style={{ float: 'right' }}
            >
                Log out
            </button>

            <h1>Manage Concerts</h1>
            <Link to="/admin/concerts/new">+ Add Concert</Link>

            <table style={{ width: '100%', marginTop: '1.5rem', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #333' }}>
                        <th>Artist</th>
                        <th>Venue</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {concerts?.map((concert) => (
                        <tr key={concert.id} style={{ borderBottom: '1px solid #222' }}>
                            <td>{concert.artist}</td>
                            <td>{concert.venue}</td>
                            <td>{concert.date}</td>
                            <td>
                                <Link to={`/admin/concerts/${concert.id}/edit`}>Edit</Link>
                                {' · '}
                                <button
                                    onClick={() => {
                                        if (confirm(`Delete ${concert.artist}'s concert?`)) {
                                            deleteMutation.mutate(concert.id);
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminConcerts;
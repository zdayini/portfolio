import { useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getConcertPhotos, uploadPhoto, deletePhoto } from '../../lib/api';

function PhotoManager({ concertId }: { concertId: number }) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: photos, isLoading } = useQuery({
        queryKey: ['concertPhotos', concertId],
        queryFn: () => getConcertPhotos(concertId),
    });

    const uploadMutation = useMutation({
        mutationFn: (file: File) => uploadPhoto(concertId, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['concertPhotos', concertId] });
            queryClient.invalidateQueries({ queryKey: ['photos'] }); // the "all photos" list used on the home ticket grid
            if (fileInputRef.current) fileInputRef.current.value = '';
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deletePhoto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['concertPhotos', concertId] });
            queryClient.invalidateQueries({ queryKey: ['photos'] });
        },
    });

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) uploadMutation.mutate(file);
    }

    if (isLoading) return <p>Loading photos...</p>;

    return (
        <div style={{ marginTop: '2rem' }}>
            <h2>Photos</h2>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploadMutation.isPending}
            />
            {uploadMutation.isPending && <p>Uploading...</p>}
            {uploadMutation.isError && <p style={{ color: 'salmon' }}>Upload failed.</p>}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem',
                }}
            >
                {photos?.map((photo, index) => (
                    <div key={photo.id} style={{ position: 'relative' }}>
                        <img
                            src={photo.url}
                            alt=""
                            style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6 }}
                        />
                        {index === 0 && (
                            <span
                                style={{
                                    position: 'absolute',
                                    top: 4,
                                    left: 4,
                                    background: '#f1dcd4',
                                    color: '#111',
                                    fontSize: '0.7rem',
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                }}
                            >
                                Cover
                            </span>
                        )}
                        <button
                            onClick={() => {
                                if (confirm('Delete this photo?')) deleteMutation.mutate(photo.id);
                            }}
                            style={{ display: 'block', width: '100%', marginTop: 4 }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {photos?.length === 0 && <p>No photos yet.</p>}
        </div>
    );
}

export default PhotoManager;
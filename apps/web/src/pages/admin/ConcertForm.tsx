import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createConcert, updateConcert, getConcert } from '../../lib/api';
import { concertFormSchema } from '../../lib/schemas';
import PhotoManager from './PhotoManager';

function ConcertForm() {
    const { id } = useParams();
    const isEditing = Boolean(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: existing } = useQuery({
        queryKey: ['concert', id],
        queryFn: () => getConcert(Number(id)),
        enabled: isEditing,
    });

    const [form, setForm] = useState({
        artist: '',
        venue: '',
        city: '',
        country: '',
        date: '',
        rating: '',
        title: '',
    });

    useEffect(() => {
        if (existing) {
            setForm({
                artist: existing.artist ?? '',
                venue: existing.venue ?? '',
                city: existing.city ?? '',
                country: existing.country ?? '',
                date: existing.date ?? '',
                rating: existing.rating?.toString() ?? '',
                title: existing.title ?? '',
            });
        }
    }, [existing]);

    const [errors, setErrors] = useState<Record<string, string>>({});

    const mutation = useMutation({
        mutationFn: () => {
            const payload = {
                ...form,
                rating: form.rating ? Number(form.rating) : undefined,
            };
            return isEditing ? updateConcert(Number(id), payload) : createConcert(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['concerts'] });
            navigate('/admin');
        },
        onError: (err: Error) => {
            setErrors({ form: err.message });
        },
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        const result = concertFormSchema.safeParse(form);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0] as string] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        mutation.mutate();
    }

    function handleChange(field: string, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
            <h1>{isEditing ? 'Edit Concert' : 'Add Concert'}</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(['artist', 'venue', 'city', 'country', 'title'] as const).map((field) => (
                    <div key={field}>
                        <label style={{ display: 'block', textTransform: 'capitalize' }}>{field}</label>
                        <input
                            value={form[field]}
                            onChange={(e) => handleChange(field, e.target.value)}
                        />
                        {errors[field] && <p style={{ color: 'salmon', margin: 0 }}>{errors[field]}</p>}
                    </div>
                ))}

                <div>
                    <label style={{ display: 'block' }}>Date</label>
                    <input
                        type="date"
                        value={form.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                    />
                    {errors.date && <p style={{ color: 'salmon', margin: 0 }}>{errors.date}</p>}
                </div>

                <div>
                    <label style={{ display: 'block' }}>Rating (1-5)</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={form.rating}
                        onChange={(e) => handleChange('rating', e.target.value)}
                    />
                    {errors.rating && <p style={{ color: 'salmon', margin: 0 }}>{errors.rating}</p>}
                </div>

                {errors.form && <p style={{ color: 'salmon' }}>{errors.form}</p>}

                <button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
            </form>
            {isEditing && <PhotoManager concertId={Number(id)} />}
        </div>
    );
}

export default ConcertForm;
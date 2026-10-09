import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../lib/api';

function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const token = await login(password);
            localStorage.setItem('admin_token', token);
            navigate('/admin');
        } catch {
            setError('Wrong password');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 360, margin: '4rem auto' }}>
            <h1>Admin Login</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                />
                {error && <p style={{ color: 'salmon', margin: 0 }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Checking...' : 'Log in'}
                </button>
            </form>
        </div>
    );
}

export default Login;
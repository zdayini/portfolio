import { Navigate } from 'react-router-dom';

function RequireAuth({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('admin_token');

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}

export default RequireAuth;
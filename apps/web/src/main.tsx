import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import ConcertDetail from './pages/ConcertDetail.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminConcerts from './pages/admin/AdminConcerts';
import ConcertForm from './pages/admin/ConcertForm.tsx';
import Login from './pages/admin/Login.tsx';
import RequireAuth from './components/RequireAuth.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/concerts/:id" element={<ConcertDetail />} />
          <Route path="/admin" element={<AdminConcerts />} />
          <Route path="/admin/concerts/new" element={<ConcertForm />} />
          <Route path="/admin/concerts/:id/edit" element={<ConcertForm />} />
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminConcerts />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/concerts/new"
            element={
              <RequireAuth>
                <ConcertForm />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/concerts/:id/edit"
            element={
              <RequireAuth>
                <ConcertForm />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Dashboard from '@/pages/Dashboard/Dashboard';
import Login from '@/pages/Login/Login';
import { ProtectedRoute } from './ProtectedRoute ';

export const RouterProvider = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

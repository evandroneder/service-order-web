import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './auth/private-route';
import { PublicRoute } from './auth/public-route';
import { DashboardPage } from './pages/dashboard.page';
import { LoginPage } from './pages/login.page';
import { ServiceOrderPage } from './pages/create-service-order.page';
import { ViewServiceOrderPage } from './pages/view-service-order.page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/service-order/new"
          element={
            <PrivateRoute>
              <ServiceOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/service-order/:id"
          element={
            <PrivateRoute>
              <ViewServiceOrderPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

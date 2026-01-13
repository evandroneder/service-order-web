import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './auth/private-route';
import { PublicRoute } from './auth/public-route';
import { DefaultLayout } from './layouts/default.layout';
import { ServiceOrderPage } from './pages/create-service-order.page';
import { ServiceOrderListPage } from './pages/list-service-order.page';
import { LoginPage } from './pages/login.page';
import { ViewServiceOrderPage } from './pages/view-service-order.page';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* PRIVATE + LAYOUT */}
        <Route
          element={
            <PrivateRoute>
              <DefaultLayout />
            </PrivateRoute>
          }>
          <Route path="/" element={<ServiceOrderListPage />} />

          <Route path="/service-orders/new" element={<ServiceOrderPage />} />

          <Route
            path="/service-orders/view/:id"
            element={<ViewServiceOrderPage />}
          />

          <Route
            path="/service-orders/edit/:id"
            element={<ServiceOrderPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

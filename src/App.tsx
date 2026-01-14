import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './core/auth/private-route';
import { PublicRoute } from './core/auth/public-route';
import { DefaultLayout } from './core/layouts/default.layout';
import { ServiceOrderPage } from './pages/service-order/create-service-order.page';
import { ServiceOrderListPage } from './pages/service-order/list-service-order.page';
import { LoginPage } from './pages/login.page';
import { ViewServiceOrderPage } from './pages/service-order/view-service-order.page';

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

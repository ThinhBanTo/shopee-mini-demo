import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { ToastProvider } from './components/Toast';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DemoGuidePage } from './pages/DemoGuidePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Stub/Pages for Phase 2 & 3 - we will expand them in respective phases
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminApprovalsPage } from './pages/AdminApprovalsPage';
import { ShipperPortalPage } from './pages/ShipperPortalPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />

            {/* Seller routes */}
            <Route path="seller" element={<SellerDashboardPage />} />
            <Route path="seller/products" element={<SellerDashboardPage />} />
            <Route path="seller/products/new" element={<SellerDashboardPage defaultTab="new-product" />} />
            <Route path="seller/orders" element={<SellerDashboardPage defaultTab="orders" />} />

            {/* Admin routes */}
            <Route path="admin" element={<AdminApprovalsPage />} />
            <Route path="admin/approvals" element={<Navigate to="/admin" replace />} />

            {/* Shipper routes */}
            <Route path="shipper" element={<ShipperPortalPage />} />

            {/* Demo guide & 404 */}
            <Route path="demo-guide" element={<DemoGuidePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;

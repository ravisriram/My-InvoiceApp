import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Estimates } from './pages/Estimates';
import { DeliveryNotes } from './pages/DeliveryNotes';
import { EstimateView } from './pages/EstimateView';
import { DeliveryNoteView } from './pages/DeliveryNoteView';
import { InvoiceForm } from './components/forms/InvoiceForm';
import { EstimateForm } from './components/forms/EstimateForm';
import { DeliveryNoteForm } from './components/forms/DeliveryNoteForm';
import { InvoiceView } from './pages/InvoiceView';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '12px 16px'
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
            loading: {
              iconTheme: {
                primary: '#3B82F6',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          <Route path="*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Dashboard />} />
                  <Route path="/invoices/new" element={<InvoiceForm />} />
                  <Route path="/invoices/:id" element={<InvoiceView />} />
                  <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
                  <Route path="/estimates" element={<Estimates />} />
                  <Route path="/estimates/new" element={<EstimateForm />} />
                  <Route path="/estimates/:id" element={<EstimateView />} />
                  <Route path="/estimates/:id/edit" element={<EstimateForm />} />
                  <Route path="/delivery-notes" element={<DeliveryNotes />} />
                  <Route path="/delivery-notes/new" element={<DeliveryNoteForm />} />
                  <Route path="/delivery-notes/:id" element={<DeliveryNoteView />} />
                  <Route path="/delivery-notes/:id/edit" element={<DeliveryNoteForm />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
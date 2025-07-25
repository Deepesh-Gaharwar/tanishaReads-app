import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import BookDetails from './pages/BookDetails';
import Stats from './pages/Stats';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound'; // Create a simple fallback 404 page
import Feedback from './pages/Feedback';

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Admin login page without NavBar/Footer */}
        <Route path="/admin" element={<Login />} />

        <Route element={<Layout />}>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/feedback" element={< Feedback />} />

          {/* Admin protected pages */}
          <Route element={<PrivateRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/stats" element={<Stats />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

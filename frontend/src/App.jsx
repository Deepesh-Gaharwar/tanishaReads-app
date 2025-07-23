import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import BookDetails from './pages/BookDetails';
import Stats from './pages/Stats'; // if you're using stats page
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login'; // still named Login.jsx but path is /admin

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/admin" element={<Login />} /> {/* Renamed route */}
          <Route element={<PrivateRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import Upload from './pages/Upload';
import BookDetails from './pages/BookDetails';
import Stats from './pages/Stats';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Feedback from './pages/Feedback';

const App = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route element={<PrivateRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/stats" element={<Stats />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

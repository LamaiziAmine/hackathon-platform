import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';

const HomePage = () => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
            <Hero />
        </main>
        <Footer />
    </div>
);

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
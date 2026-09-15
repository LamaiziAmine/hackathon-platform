import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import HackathonList from './pages/HackathonList';
import ApplyForm from './pages/ApplyForm';
import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminHackathons from './pages/admin/AdminHackathons';
import AdminApplications from './pages/admin/AdminApplications';
import AdminTeams from './pages/admin/AdminTeams';
import AdminDeliverables from './pages/admin/AdminDeliverables';


const HomePage = () => {
    useEffect(() => {
        document.title = "PlaThon - Plateforme Nationale des Hackathons";
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <Hero />
            </main>
            <Footer />
        </div>
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hackathons" element={<HackathonList />} />
                <Route path="/apply/:id" element={<ApplyForm />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminHome />} />
                    <Route path="hackathons" element={<AdminHackathons />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="teams" element={<AdminTeams />} />
                    <Route path="deliverables" element={<AdminDeliverables />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
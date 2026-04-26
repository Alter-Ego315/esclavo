import React, { useEffect, useState } from 'react';

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import About from './components/landing/About';
import Services from './components/landing/Services';
import Portfolio from './components/landing/Portfolio';
import Contact from './components/landing/Contact';
import Footer from './components/landing/Footer';
import PrivacyModal from './components/landing/PrivacyModal';
import Chatbot from './components/landing/Chatbot';
import LegalModal from './components/landing/LegalModal';

import './index.css';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const HomePage = ({ setContactMessage, contactMessage, openPrivacy }) => (
    <>
        <Hero />
        <About />
        <Services setContactMessage={setContactMessage} />
        <Contact contactMessage={contactMessage} openPrivacy={openPrivacy} />
    </>
);

function App() {
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isLegalOpen, setIsLegalOpen] = useState(false);
    const [showCookiePreferences, setShowCookiePreferences] = useState(false);
    const [contactMessage, setContactMessage] = useState('');

    const openPrivacy = (e) => {
        if (e) e.preventDefault();
        setIsPrivacyOpen(true);
    };

    const closePrivacy = () => {
        setIsPrivacyOpen(false);
    };

    const openLegal = (e) => {
        if (e) e.preventDefault();
        setIsLegalOpen(true);
    };

    const closeLegal = () => {
        setIsLegalOpen(false);
    };

    const openCookiePreferences = (e) => {
        if (e) e.preventDefault();
        setShowCookiePreferences(true);
    };

    const closeCookiePreferences = () => {
        setShowCookiePreferences(false);
    };

    useEffect(() => {
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        const observeSections = () => {
            document.querySelectorAll('.section').forEach(section => {
                if (section.style.opacity === '') {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(20px)';
                    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                }
                observer.observe(section);
            });
        };

        observeSections();
        const timeout = setTimeout(observeSections, 500);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <Router>
            <ScrollToTop />
            <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>
                <Navbar />
                <div style={{ paddingTop: '100px' }}>
                    <Routes>
                        <Route path="/" element={
                            <HomePage 
                                setContactMessage={setContactMessage} 
                                contactMessage={contactMessage}
                                openPrivacy={openPrivacy} 
                            />
                        } />
                        <Route path="/experiencia" element={<Portfolio />} />
                    </Routes>
                </div>
                <PrivacyModal isOpen={isPrivacyOpen} onClose={closePrivacy} />
                <LegalModal isOpen={isLegalOpen} onClose={closeLegal} />
                {/* <CookieConsent showPreferences={showCookiePreferences} setShowPreferences={setShowCookiePreferences} /> */}
                <Chatbot />
                <Footer 
                    openPrivacy={openPrivacy}
                    openLegal={openLegal}
                    openCookiePreferences={openCookiePreferences}
                />
            </div>
        </Router>
    );
}

export default App;

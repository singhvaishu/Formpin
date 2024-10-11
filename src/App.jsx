import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import OTPVerification from './components/OTPVerification';
import FinalPage from './components/FinalPage';

function App() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        qualification: '',
        referral: '',
        pinCode: '',
        city: '',
        state: '',
        password: ''
    });

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignupForm formData={formData} setFormData={setFormData} />} />
                <Route path="/otp" element={<OTPVerification formData={formData} setFormData={setFormData} />} />
                <Route path="/success" element={<FinalPage formData={formData} />} />
            </Routes>
        </Router>
    );
}

export default App;

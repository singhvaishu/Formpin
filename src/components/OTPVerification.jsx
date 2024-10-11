
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

const OTPVerification = ({ formData, setFormData }) => {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(180); // 3 minutes countdown
    const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken') || '');

    useEffect(() => {
        if (!jwtToken) {
            alert('No OTP request found. Please sign up again.');
            navigate('/');
            return;
        }

        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    alert('OTP expired. Please request a new one.');
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [jwtToken, navigate]);

    // Validation schema for OTP
    const validationSchema = Yup.object().shape({
        otp: Yup.string()
            .matches(/^[0-9]{4}$/, 'OTP must be 4 digits')
            .required('OTP is required'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                'https://web-rupay-lender-back-production.up.railway.app/auth/mobile-verify',
                { mobile: formData.mobile, otp: data.otp },
                {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                }
            );

            if (response.data.success) {
                localStorage.setItem('isMobileVerified', 'true');
                alert('Mobile number verified!');
                navigate('/'); // Navigate back to signup 
            } else {
                alert('Invalid OTP. Please try again.');
            }
        } catch (error) {
            console.error('Verification failed:', error.response?.data || error.message);
            alert(`Verification failed. ${error.response?.data?.message || error.message}`);
        }
    };

    const resendOTP = async () => {
        try {
            const response = await axios.post(
                'https://web-rupay-lender-back-production.up.railway.app/auth/send-otp',
                { mobile: formData.mobile }
            );
            const { otpToken } = response.data;
            localStorage.setItem('jwtToken', otpToken);
            setJwtToken(otpToken);
            setTimer(180); // Reset the timer
            alert('OTP resent successfully!');
        } catch (error) {
            console.error('Failed to resend OTP:', error.response?.data || error.message);
            alert(`Failed to resend OTP. ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Box className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <Typography variant="h6" gutterBottom className="text-center mb-4">
                    OTP Verification
                </Typography>
                <Typography gutterBottom className="text-center">
                    Enter the OTP sent to your mobile number: <strong>{formData.mobile}</strong>
                </Typography>
                <Typography variant="body2" gutterBottom className="text-center text-red-600 mb-6">
                    Time remaining: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                        label="OTP"
                        fullWidth
                        {...register('otp')}
                        error={!!errors.otp}
                        helperText={errors.otp?.message}
                        className="bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 rounded"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2"
                    >
                        Verify OTP
                    </Button>
                </form>
                <Button
                    onClick={resendOTP}
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    className={`mt-4 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 ${timer > 0 ? 'cursor-not-allowed opacity-50' : ''
                        }`}
                    disabled={timer > 0} // Disable until the timer reaches zero
                >
                    Resend OTP
                </Button>
            </Box>
        </div>
    );
};

export default OTPVerification;

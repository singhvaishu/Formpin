
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';

const SignupForm = ({ formData, setFormData }) => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
            .required('Mobile number is required'),
        qualification: Yup.string().required('Qualification is required'),
        pinCode: Yup.string()
            .matches(/^[0-9]{6}$/, 'Pin Code must be 6 digits')
            .required('Pin Code is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: formData,
    });

    // Check if the mobile number is verified
    const isMobileVerified = localStorage.getItem('isMobileVerified') === 'true';

    const onSubmit = async (data) => {
        // If verified
        if (isMobileVerified) {

            console.log('Submitting final data:', { ...formData, ...data });
            // Navigate to the final page
            navigate('/success');
        } else {
            // If  not verified
            setFormData({ ...formData, ...data });
            try {
                const response = await axios.post('https://web-rupay-lender-back-production.up.railway.app/auth/send-otp', { mobile: data.mobile });
                localStorage.setItem('jwtToken', response.data.otpToken);
                navigate('/otp');
            } catch (error) {
                console.error('Error sending OTP:', error.response?.data || error.message);
                alert('Failed to send OTP.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Box className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <Typography variant="h5" gutterBottom className="text-center mb-6">
                    Registration
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        {['name', 'email', 'mobile', 'qualification', 'referral', 'pinCode', 'city', 'state', 'password'].map((field) => (
                            <Grid item xs={12} key={field}>
                                <TextField
                                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                                    type={field === 'password' ? 'password' : 'text'}
                                    fullWidth
                                    disabled={field === 'mobile' && isMobileVerified} // Disable mobile if verified
                                    {...register(field)}
                                    error={!!errors[field]}
                                    helperText={errors[field]?.message}
                                    className="focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                className="mt-2 bg-indigo-600 hover:bg-indigo-700"
                            >
                                {isMobileVerified ? 'Submit' : 'Send OTP'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </div>
    );
};

export default SignupForm;

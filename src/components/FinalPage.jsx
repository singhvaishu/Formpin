

import React from 'react';
import { Box, Typography } from '@mui/material';

const FinalPage = ({ formData }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
            <Box
                className="w-full sm:max-w-sm md:max-w-md lg:max-w-lg bg-white p-6 sm:p-8 rounded-lg shadow-md"
            >
                <Typography
                    variant="h5"
                    className="text-center mb-4 sm:mb-6 text-indigo-600"
                >
                    Form Submitted Successfully
                </Typography>
                <div
                    className="bg-gray-50 p-3 sm:p-4 rounded-md overflow-auto"
                >
                    <pre className="text-xs sm:text-sm text-gray-700">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
            </Box>
        </div>
    );
};

export default FinalPage;


'use client';

import React, { useState } from 'react';
import useRequest from '@/hooks/use-request';

const SignUp = () => {
   const {errors,makeRequest} = useRequest();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        makeRequest("/api/user/signup","post",{ email, password})
    };

    // Helper to display specific field error
    const getFieldError = (field) => {
        return errors.find(err => err.field === field)?.message;
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Sign Up
                </h1>

                {/* General Error Message */}
                {errors.length > 0 && !errors.some(err => err.field) && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                        {errors[0].message}
                    </div>
                )}

                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="email"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-3 border ${getFieldError('email') ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="Enter your email"
                    />
                    {getFieldError('email') && (
                        <p className="text-red-500 text-sm mt-2">{getFieldError('email')}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-medium mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full p-3 border ${getFieldError('password') ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        placeholder="Enter your password"
                    />
                    {getFieldError('password') && (
                        <p className="text-red-500 text-sm mt-2">{getFieldError('password')}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default SignUp;

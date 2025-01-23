import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Stethoscope, Cable } from 'lucide-react';

const AnemiaDetectionHomepage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md py-4 px-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Heart className="text-red-500" size={32} />
                        <h1 className="text-2xl font-bold text-gray-800">
                            Anemia Detection Assistant
                        </h1>
                    </div>
                    <nav className="space-x-4">
                        <Link
                            href="#about"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            About
                        </Link>
                        <Link
                            href="#features"
                            className="text-gray-600 hover:text-blue-600 transition"
                        >
                            Features
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
                {/* Left Side - Information */}
                <div className="space-y-6">
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Your Personal Anemia Screening Companion
                    </h2>
                    <p className="text-xl text-gray-600">
                        Detect early signs of anemia through an intelligent, user-friendly
                        chatbot powered by advanced medical insights.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Stethoscope className="text-blue-500" size={24} />
                            <span className="text-gray-700">
                                Comprehensive health assessment
                            </span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Cable className="text-green-500" size={24} />
                            <span className="text-gray-700">
                                Interactive symptom evaluation
                            </span>
                        </div>
                    </div>

                    {/* Call to Action Button */}
                    <Link
                        href="/chat"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white 
            rounded-lg hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
                    >
                        Start Anemia Check
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                </div>

                {/* Right Side - Illustration */}
                <div className="flex justify-center items-center">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <Image
                            src="/images/anemia-illustration.png"
                            alt="Anemia Detection Illustration"
                            width={500}
                            height={400}
                            className="rounded-xl max-w-full h-auto"
                        />
                    </div>
                </div>
            </main>

            {/* Features Section */}
            <section className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
                        Key Features
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-blue-50 p-6 rounded-lg text-center">
                            <Stethoscope className="mx-auto text-blue-600 mb-4" size={48} />
                            <h4 className="text-xl font-semibold mb-3">
                                Comprehensive Screening
                            </h4>
                            <p className="text-gray-600">
                                Detailed assessment of potential anemia indicators
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-green-50 p-6 rounded-lg text-center">
                            <Cable className="mx-auto text-green-600 mb-4" size={48} />
                            <h4 className="text-xl font-semibold mb-3">
                                Interactive Consultation
                            </h4>
                            <p className="text-gray-600">
                                Personalized symptom evaluation and guidance
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-red-50 p-6 rounded-lg text-center">
                            <Heart className="mx-auto text-red-600 mb-4" size={48} />
                            <h4 className="text-xl font-semibold mb-3">
                                Early Detection
                            </h4>
                            <p className="text-gray-600">
                                Identify potential anemia risks before they escalate
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-6 border-t">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    © {new Date().getFullYear()} Anemia Detection Assistant.
                    All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AnemiaDetectionHomepage;
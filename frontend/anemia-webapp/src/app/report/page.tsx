"use client"; // Enables interactivity for event handlers

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AnemiaReport = () => {
    const [userData, setUserData] = useState(null);
    const [analysisResults, setAnalysisResults] = useState(null);

    const router = useRouter();

    useEffect(() => {
        const firstVariable = localStorage.getItem('userData'); // Replace with your variable name
        const secondVariable = localStorage.getItem('analysisResults'); // Replace with your variable name

        // Redirect logic
        if (!firstVariable) {
            router.push('/chat'); // Redirect to /chat if the first variable is missing
        } else if (!secondVariable) {
            router.push('/analysis-page'); // Redirect to /analysis-page if the second variable is missing
        }
    }, [router]);

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem("userData")) || {
            name: "John Doe",
            gender: "Male",
            age: 28,
            bloodGroup: "O+",
            symptoms: "Fatigue, Dizziness",
        };
        const storedAnalysisResults = JSON.parse(localStorage.getItem("analysisResults")) || {
            nail: { class: "Anemic", confidence: 85.32 },
            palm: { class: "Non_Anemic", confidence: 72.45 },
            eye: { class: "Anemic", confidence: 90.15 },
            final_result: { class: "Anemic", average_confidence: 82.64 },
        };

        setUserData(storedUserData);
        setAnalysisResults(storedAnalysisResults);
    }, []);

    const handleDownload = () => {
        window.print();
    };

    if (!userData || !analysisResults) {
        return <p>Loading...</p>;
    }

    return (
        <div id="report-content" className="p-8 bg-gray-100 font-sans min-h-screen">
            <div className="bg-white shadow-lg p-6 rounded-lg max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
                    AnemoTech Anemia Detection Report
                </h1>
                <p className="text-right text-gray-600">
                    Date: {new Date().toLocaleDateString()}
                </p>

                {/* Disclaimer */}
                <p className="text-red-600 font-bold text-center mt-4">
                    This report is based on AI analysis. For accurate diagnosis and treatment, please consult a qualified healthcare provider.
                </p>

                {/* Patient Information */}
                <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Patient Information</h2>
                <div className="border border-gray-300 p-4 rounded-md bg-gray-50">
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Gender:</strong> {userData.gender}</p>
                    <p><strong>Age:</strong> {userData.age}</p>
                    <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>
                    <p><strong>Reported Symptoms:</strong> {userData.symptoms}</p>
                </div>

                {/* Analysis Results */}
                <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Anemia Detection Results</h2>
                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">Test Type</th>
                            <th className="border border-gray-300 p-2">Classification</th>
                            <th className="border border-gray-300 p-2">Confidence Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2">Nail</td>
                            <td className="border border-gray-300 p-2">{analysisResults.nail.class}</td>
                            <td className="border border-gray-300 p-2">{analysisResults.nail.confidence.toFixed(2) * 100}%</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Palm</td>
                            <td className="border border-gray-300 p-2">{analysisResults.palm.class}</td>
                            <td className="border border-gray-300 p-2">{analysisResults.palm.confidence.toFixed(2) * 100}%</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Eye</td>
                            <td className="border border-gray-300 p-2">{analysisResults.eye.class}</td>
                            <td className="border border-gray-300 p-2">{analysisResults.eye.confidence.toFixed(2) * 100}%</td>
                        </tr>
                    </tbody>
                </table>

                {/* Final Analysis */}
                <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Final Analysis</h2>
                <div className="border border-gray-300 p-4 rounded-md bg-gray-50">
                    <p><strong>Overall Diagnosis:</strong> {analysisResults.final_result.class}</p>
                    <p><strong>Confidence Score:</strong> {analysisResults.final_result.average_confidence.toFixed(2) * 100}%</p>
                </div>

                {/* Additional Precautions */}
                <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Precautions and Recommendations</h2>
                <ul className="list-disc list-inside text-gray-600">
                    <li>Consult a doctor if diagnosed as <strong>Anemic</strong> or experiencing persistent symptoms.</li>
                    <li>Consume iron-rich foods (e.g., leafy greens, lentils, eggs, and lean meats).</li>
                    <li>Include vitamin C-rich foods (e.g., oranges, strawberries) to improve iron absorption.</li>
                    <li>Stay hydrated and maintain a balanced diet to support overall health.</li>
                    <li>Avoid excessive intake of tea/coffee during meals as they inhibit iron absorption.</li>
                    <li>Ensure regular follow-ups and blood tests to monitor hemoglobin levels.</li>
                    <li>Discuss any ongoing medications or supplements with a healthcare provider.</li>
                </ul>

                {/* Important Aspects */}
                <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-700">Key Information</h2>
                <p className="text-gray-700">
                    This report includes:
                </p>
                <ul className="list-disc list-inside text-gray-600">
                    <li>Patient demographic and symptom information.</li>
                    <li>AI-driven analysis of anemia indicators through nail, palm, and eye data.</li>
                    <li>A summary of confidence scores to assess the likelihood of anemia.</li>
                    <li>Personalized precautions and dietary recommendations.</li>
                </ul>

                {/* Closing Note */}
                <p className="text-sm text-gray-500 mt-6">
                    <i>AnemoTech - Combining Technology with Compassion for Better Health</i>
                </p>

                {/* Download Report Button */}
                <button
                    onClick={handleDownload}
                    className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 print:hidden"
                >
                    Download Report as PDF
                </button>
            </div>
        </div>
    );
};

export default AnemiaReport;

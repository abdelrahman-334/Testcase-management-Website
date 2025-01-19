// src/components/HeroSection.js
import React from 'react';

const HeroSection = () => {
  return (
    <section className="text-center py-20 bg-gray-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">
        AI-Driven Test Management Solutions
      </h2>
      <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
        Welcome to Testit, the AI-driven testing solution! Discover advanced test case management with AI prioritization, ensuring efficiency and precision. Elevate your testing experience and deliver quality products faster with our innovative platform.
      </p>
      <a
        href="#get-started"
        className="px-6 py-3 bg-green-500 text-white text-lg font-medium rounded-md shadow hover:bg-green-600"
      >
        Get Started
      </a>
    </section>
  );
};

export default HeroSection;

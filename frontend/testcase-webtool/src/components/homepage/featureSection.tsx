// src/components/FeaturesSection.js
import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Priority Boost',
      description:
        'Leverage AI to prioritize critical test cases, streamline workflows, and improve software quality effortlessly.',
    },
    {
      title: 'Efficient Focus',
      description:
        'AI-driven algorithms optimize test case prioritization, ensuring your team focuses on the most important tests first.',
    },
    {
      title: 'Accurate Insights',
      description:
        'Increase accuracy with AI-enhanced testing data analysis, ensuring reliable and precise results.',
    }
  ];

  return (
    <section className="py-20 bg-white">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
        AI-Driven Test Case Prioritization
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

import React from 'react';

const SupportSection = () => {
  const cards = [
    {
      title: "Donate",
      text: "Your generosity fuels our ability to provide resources, gifts, and programs that inspire women on their cancer journeys. Every dollar makes a difference.",
      buttonText: "Make a Donation",
      buttonUrl: "#"
    },
    {
      title: "Volunteer",
      text: "We welcome individuals passionate about making a positive impact. From organizing events to assembling care packages, your time and talent can change lives.",
      buttonText: "Become a Volunteer",
      buttonUrl: "#"
    },
    {
      title: "Nominate Someone in Need",
      text: "Know someone who could benefit from our services? Whether they’re undergoing treatment, a caregiver, or a cancer conqueror, we’d love to celebrate and support them.",
      buttonText: "Submit a Nomination",
      buttonUrl: "#"
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Support Our Mission</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-gray-700 mb-4 text-center">{card.text}</p>
              <a href={card.buttonUrl} className="mt-4">
                <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg rounded-md">
                  {card.buttonText}
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SupportSection;
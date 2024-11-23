'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Card } from '@/components/ui/card';
import PayPalButton from './PayPalButton';

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

const SupportSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card key={index} className="p-6 bg-white shadow-lg rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
              <p className="text-gray-600 mb-6">{card.text}</p>
              {card.title === "Donate" ? (
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {card.buttonText}
                </button>
              ) : (
                <a
                  href={card.buttonUrl}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {card.buttonText}
                </a>
              )}
            </Card>
          ))}
        </div>
        {/* Modal Section */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="App">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Make a Donation</h2>
              <PayPalButton />
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                All donations are secure and encrypted. You can choose to make this a monthly donation 
                during the PayPal checkout process.
              </p>
            </Card>
            <Message content={message} />
          </div>
        </Modal>
      </div>
    </div>
  );
};

// TypeScript-friendly Message Component
type MessageProps = {
  content: string;
};

function Message({ content }: MessageProps) {
  return <p>{content}</p>;
}

export default SupportSection;

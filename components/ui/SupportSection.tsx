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
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isNominateModalOpen, setIsNominateModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenVolunteerModal = () => {
    setIsVolunteerModalOpen(true);
  };

  const handleCloseVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
  };

  const handleOpenNominateModal = () => {
    setIsNominateModalOpen(true);
  };

  const handleCloseNominateModal = () => {
    setIsNominateModalOpen(false);
  };

  const handleVolunteerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mock email sending functionality
    console.log("Form submitted:", new FormData(e.target as HTMLFormElement));
    alert("Thank you for volunteering!");
    setIsVolunteerModalOpen(false);
  };

  const handleNominateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mock email sending functionality
    console.log("Form submitted:", new FormData(e.target as HTMLFormElement));
    alert("Thank you for your nomination!");
    setIsNominateModalOpen(false);
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card key={index} className="p-6 bg-white shadow-lg rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
              <p className="text-gray-600 mb-6">{card.text}</p>
              {card.title === "Donate" ? (
                <button
                  onClick={handleOpenModal}
                  className="px-4 py-2 bg-pink-600 text-white rounded mx-auto"
                >
                  {card.buttonText}
                </button>
              ) : card.title === "Volunteer" ? (
                <button
                  onClick={handleOpenVolunteerModal}
                  className="px-4 py-2 bg-pink-600 text-white rounded mx-auto"
                >
                  {card.buttonText}
                </button>
              ) : card.title === "Nominate Someone in Need" ? (
                <button
                  onClick={handleOpenNominateModal}
                  className="px-4 py-2 bg-pink-600 text-white rounded mx-auto"
                >
                  {card.buttonText}
                </button>
              ) : (
                <a
                  href={card.buttonUrl}
                  className="px-4 py-2 bg-pink-600 text-white rounded mx-auto"
                >
                  {card.buttonText}
                </a>
              )}
            </Card>
          ))}
        </div>
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
        <Modal isOpen={isVolunteerModalOpen} onClose={handleCloseVolunteerModal}>
          <div className="App">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Volunteer</h2>
              <form onSubmit={handleVolunteerSubmit}>
                <input type="hidden" name="subject" value="Volunteer" />
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">Name</label>
                  <input type="text" id="name" name="name" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300">Message</label>
                  <textarea id="message" name="message" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required></textarea>
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg">Submit</button>
              </form>
            </Card>
          </div>
        </Modal>
        <Modal isOpen={isNominateModalOpen} onClose={handleCloseNominateModal}>
          <div className="App">
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nominate Someone in Need</h2>
              <form onSubmit={handleNominateSubmit}>
                <input type="hidden" name="subject" value="Nominate Someone in Need" />
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">Name</label>
                  <input type="text" id="name" name="name" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" id="email" name="email" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-gray-700 dark:text-gray-300">Message</label>
                  <textarea id="message" name="message" className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600" required></textarea>
                </div>
                <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg">Submit</button>
              </form>
            </Card>
          </div>
        </Modal>
      </div>
    </div>
  );
};

function Message({ content }: { content: string }) {
  return <p>{content}</p>;
}

export default SupportSection;

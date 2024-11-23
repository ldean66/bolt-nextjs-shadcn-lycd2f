'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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

  const initialOptions = {
    clientId: "AQ4PrpTu_EbFwdVp5RcIokRSQDnb-ay0pcv79gVs63XVEMAt_9mdvpBCDw2ActZoVKm77uOaYe2CHF3k",
    "enable-funding": "paylater,venmo,card",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="App">
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{
                  shape: "pill",
                }}
                onApprove={async (data, actions) => {
                  // Handle the payment approval
                }}
              />
            </PayPalScriptProvider>
            <Message content={message} />
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
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
    "client-id": "AQ4PrpTu_EbFwdVp5RcIokRSQDnb-ay0pcv79gVs63XVEMAt_9mdvpBCDw2ActZoVKm77uOaYe2CHF3k",
    "enable-funding": "paylater,venmo,card",
    "disable-funding": "",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">Support Our Mission</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
              <p className="text-gray-700 mb-4 text-center">{card.text}</p>
              <button
                onClick={handleOpenModal}
                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-4 text-lg rounded-md"
              >
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="App">
          <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
              style={{
                shape: "pill",
                layout: "vertical",
              }}
              createOrder={async () => {
                try {
                  const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      cart: [
                        {
                          id: "YOUR_PRODUCT_ID",
                          quantity: "YOUR_PRODUCT_QUANTITY",
                        },
                      ],
                    }),
                  });

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const contentType = response.headers.get("content-type");
                  if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid content type: " + contentType);
                  }

                  const orderData = await response.json();

                  if (orderData.id) {
                    return orderData.id;
                  } else {
                    const errorDetail = orderData?.details?.[0];
                    const errorMessage = errorDetail
                      ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                      : JSON.stringify(orderData);

                    throw new Error(errorMessage);
                  }
                } catch (error) {
                  console.error(error);
                  setMessage(`Could not initiate PayPal Checkout...${error}`);
                }
              }}
              onApprove={async (data, actions) => {
                try {
                  const response = await fetch(
                    `/api/orders/${data.orderID}/capture`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    },
                  );

                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }

                  const contentType = response.headers.get("content-type");
                  if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Invalid content type: " + contentType);
                  }

                  const orderData = await response.json();

                  const errorDetail = orderData?.details?.[0];

                  if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                    return actions.restart();
                  } else if (errorDetail) {
                    throw new Error(
                      `${errorDetail.description} (${orderData.debug_id})`,
                    );
                  } else {
                    const transaction =
                      orderData.purchase_units[0].payments.captures[0];
                    setMessage(
                      `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`,
                    );
                    console.log(
                      "Capture result",
                      orderData,
                      JSON.stringify(orderData, null, 2),
                    );
                  }
                } catch (error) {
                  console.error(error);
                  setMessage(
                    `Sorry, your transaction could not be processed...${error}`,
                  );
                }
              }}
            />
          </PayPalScriptProvider>
          <Message content={message} />
        </div>
      </Modal>
    </div>
  );
};

function Message({ content }) {
  return <p>{content}</p>;
}

export default SupportSection;
import React, { useState } from "react";
import OrderSummary from "./OrderSummary";
import AddressForm from "./AddressForm";
import Modal from "./ModalCheckout"; // Create the modal component

const CheckoutPage = () => {
  const [address, setAddress] = useState(null); // Holds the saved address
  const [isEditing, setIsEditing] = useState(true); // Toggle between form and static view
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  const handleSave = (formData) => {
    // Validate address fields
    // if (
    //   !formData.name ||
    //   !formData.phone ||
    //   !formData.address ||
    //   !formData.city ||
    //   !formData.state ||
    //   !formData.zip
    // ) {
      // alert("Please fill out all required fields.");
      // return;
    // }
    setAddress(formData); // Save form data to state
    // localStorage.setItem("savedAddress", JSON.stringify(formData)); // Persist to localStorage
    setIsEditing(false); // Switch to static mode
  };

  const handleCancel = () => {
    setIsEditing(false); // Cancel editing
  };

  const handleEdit = () => {
    setIsEditing(true); // Switch to editing mode
  };

  const handleProceed = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      {/* Order Summary Section */}
      <aside className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow">
        <OrderSummary />
      </aside>

      {/* Address and Checkout Form */}
      <main className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        {isEditing ? (
          <AddressForm
            onSave={handleSave}
            onCancel={handleCancel}
            defaultValues={address}
          />
        ) : (
          <div>
            <p>
              <strong>Name:</strong> {address?.name}
            </p>
            <p>
              <strong>Phone:</strong> {address?.phone}
            </p>
            <p>
              <strong>Address:</strong> {address?.address}, {address?.city},{" "}
              {address?.state}, {address?.zip}
            </p>
            <button
              onClick={handleEdit}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Edit Address
            </button>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Proceed
            </button>
          </div>
        )}
      </main>

      {/* Modal for Order Summary */}
      {isModalOpen && <Modal onClose={handleCloseModal} address={address} />}
    </div>
  );
};

export default CheckoutPage;

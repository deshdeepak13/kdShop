import React from "react";

const SavedAddresses = () => {
  const addresses = [
    {
      id: 1,
      type: "HOME",
      name: "Desh Deepak Verma",
      phone: "6352146905",
      address: "Bhabha Bhavan, SVNIT, Surat, Surat, Gujarat - 395007",
    },
    {
      id: 2,
      type: "HOME",
      name: "Deshdeepak Verma",
      phone: "6352146905",
      address: "EWS hostel, SVNIT Campus, Surat, SURAT, Gujarat - 395007",
    },
    {
      id: 3,
      type: "HOME",
      name: "Deshdeepak Verma",
      phone: "6352146905",
      address: "Hotel Sterling, Happy Hallmark Shoppers, Surat, Gujarat - 395007",
    },
  ];

  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      alert(`Address ${addressId} deleted.`);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
        Saved Addresses
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="relative bg-gray-800 rounded-xl p-5 md:p-6 transition-all duration-300 hover:bg-gray-750 hover:shadow-lg"
          >
            {/* Address Type Badge */}
            <div className="absolute top-4 right-4 bg-indigo-900/30 text-indigo-400 px-3 py-1 rounded-full text-xs font-medium">
              {address.type}
            </div>

            {/* User Info */}
            <div className="mb-4 pr-8">
              <h3 className="text-lg font-semibold text-gray-100">
                {address.name}
              </h3>
              <p className="text-gray-400 text-sm mt-1">{address.phone}</p>
            </div>

            {/* Address Details */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm leading-6">
                {address.address}
              </p>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end border-t border-gray-700 pt-4">
              <button
                onClick={() => handleDelete(address.id)}
                className="flex items-center text-red-400 hover:text-red-300 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Address Button */}
      <div className="mt-8 flex justify-center md:justify-start">
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors duration-300">
          Add New Address
        </button>
      </div>
    </div>
  );
};

export default SavedAddresses;
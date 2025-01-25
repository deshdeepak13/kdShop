import React from "react";

const SavedAddresses = () => {
  const handleDelete = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      alert(`Address ${addressId} deleted.`);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">Saved Addresses</h2>

      {/* Address 1 Container */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-400 text-sm">HOME</span>
          <span className="text-gray-200 font-medium">Desh Deepak Verma 6352146905</span>
        </div>
        <div className="text-gray-300 text-sm">
          Bhabha Bhavan, SVNIT, Surat, Surat, Gujarat - 395007
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => handleDelete(1)}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Address 2 Container */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-400 text-sm">HOME</span>
          <span className="text-gray-200 font-medium">Deshdeepak Verma 6352146905</span>
        </div>
        <div className="text-gray-300 text-sm">
          EWS hostel, SVNIT Campus, Surat, SURAT, Gujarat - 395007
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => handleDelete(2)}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Address 3 Container */}
      <div className="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-400 text-sm">HOME</span>
          <span className="text-gray-200 font-medium">Deshdeepak Verma 6352146905</span>
        </div>
        <div className="text-gray-300 text-sm">
          Hotel Sterling, Happy Hallmark Shoppers, Surat, Gujarat - 395007
        </div>
        <div className="flex justify-end mt-3">
          <button
            onClick={() => handleDelete(3)}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Add more addresses here if needed */}
    </div>
  );
};

export default SavedAddresses;

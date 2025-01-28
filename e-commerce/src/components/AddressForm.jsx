import React from "react";
import { useForm } from "react-hook-form";

const AddressForm = ({ onSave, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    onSave(data); // Handle save logic from the parent
  };

  const handleCancel = () => {
    reset();
    onCancel(); // Call cancel logic from the parent
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label className="text-lg">Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </div>

      {/* Mobile Field */}
      <div>
        <label className="text-lg">Mobile</label>
        <input
          {...register("mobile", {
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Mobile number must be 10 digits",
            },
          })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.mobile && <p className="text-red-600">{errors.mobile.message}</p>}
      </div>

      {/* Pincode Field */}
      <div>
        <label className="text-lg">Pincode</label>
        <input
          {...register("pincode", {
            required: "Pincode is required",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Pincode must be 6 digits",
            },
          })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
      </div>

      {/* Address Fields */}
      <div>
        <label className="text-lg">Locality</label>
        <input
          {...register("locality", { required: "Locality is required" })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.locality && <p className="text-red-600">{errors.locality.message}</p>}
      </div>

      <div>
        <label className="text-lg">Address (Area and Street)</label>
        <input
          {...register("address", { required: "Address is required" })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.address && <p className="text-red-600">{errors.address.message}</p>}
      </div>

      {/* City and State Fields */}
      <div>
        <label className="text-lg">City/Town/District</label>
        <input
          {...register("city", { required: "City is required" })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.city && <p className="text-red-600">{errors.city.message}</p>}
      </div>

      <div>
        <label className="text-lg">State</label>
        <select
          {...register("state", { required: "State is required" })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        >
          <option value="">Select State</option>
          <option value="State1">State1</option>
          <option value="State2">State2</option>
          {/* Add more states as needed */}
        </select>
        {errors.state && <p className="text-red-600">{errors.state.message}</p>}
      </div>

      {/* Optional Fields */}
      <div>
        <label className="text-lg">Landmark (Optional)</label>
        <input
          {...register("landmark")}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
      </div>

      <div>
        <label className="text-lg">Alternate Phone Number (Optional)</label>
        <input
          {...register("alternatePhone", {
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Alternate phone number must be 10 digits",
            },
          })}
          className="border border-gray-600 p-3 w-full bg-gray-800 text-white rounded-lg"
        />
        {errors.alternatePhone && (
          <p className="text-red-600">{errors.alternatePhone.message}</p>
        )}
      </div>

      {/* Home/Work Checkbox */}
      <div className="flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="radio"
            value="Home"
            {...register("addressType", { required: true })}
            className="bg-gray-800"
          />
          <span className="ml-2">Home</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value="Work"
            {...register("addressType", { required: true })}
            className="bg-gray-800"
          />
          <span className="ml-2">Work</span>
        </label>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex space-x-6">
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          disabled={Object.keys(errors).length > 0}
        >
          Save
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;

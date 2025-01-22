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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Name Field */}
      <div>
        <label>Name</label>
        <input
          {...register("name", { required: "Name is required" })}
          className="border p-2 w-full"
        />
        {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      </div>

      {/* Mobile Field */}
      <div>
        <label>Mobile</label>
        <input
          {...register("mobile", {
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Mobile number must be 10 digits",
            },
          })}
          className="border p-2 w-full"
        />
        {errors.mobile && <p className="text-red-600">{errors.mobile.message}</p>}
      </div>

      {/* Pincode Field */}
      <div>
        <label>Pincode</label>
        <input
          {...register("pincode", {
            required: "Pincode is required",
            pattern: {
              value: /^[0-9]{6}$/,
              message: "Pincode must be 6 digits",
            },
          })}
          className="border p-2 w-full"
        />
        {errors.pincode && <p className="text-red-600">{errors.pincode.message}</p>}
      </div>

      {/* Address Fields */}
      <div>
        <label>Locality</label>
        <input
          {...register("locality", { required: "Locality is required" })}
          className="border p-2 w-full"
        />
        {errors.locality && <p className="text-red-600">{errors.locality.message}</p>}
      </div>

      <div>
        <label>Address (Area and Street)</label>
        <input
          {...register("address", { required: "Address is required" })}
          className="border p-2 w-full"
        />
        {errors.address && <p className="text-red-600">{errors.address.message}</p>}
      </div>

      {/* City and State Fields */}
      <div>
        <label>City/Town/District</label>
        <input
          {...register("city", { required: "City is required" })}
          className="border p-2 w-full"
        />
        {errors.city && <p className="text-red-600">{errors.city.message}</p>}
      </div>

      <div>
        <label>State</label>
        <select
          {...register("state", { required: "State is required" })}
          className="border p-2 w-full"
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
        <label>Landmark (Optional)</label>
        <input {...register("landmark")} className="border p-2 w-full" />
      </div>

      <div>
        <label>Alternate Phone Number (Optional)</label>
        <input
          {...register("alternatePhone", {
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Alternate phone number must be 10 digits",
            },
          })}
          className="border p-2 w-full"
        />
        {errors.alternatePhone && <p className="text-red-600">{errors.alternatePhone.message}</p>}
      </div>

      {/* Home/Work Checkbox */}
      <div className="flex items-center space-x-4">
        <label>
          <input type="radio" value="Home" {...register("addressType", { required: true })} />
          Home
        </label>
        <label>
          <input type="radio" value="Work" {...register("addressType", { required: true })} />
          Work
        </label>
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={Object.keys(errors).length > 0}>
          Save
        </button>
        <button type="button" onClick={handleCancel} className="bg-gray-600 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;

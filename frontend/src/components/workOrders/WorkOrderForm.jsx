import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WorkOrderForm = ({
  formData,
  setFormData,
  onSubmit,
  fieldErrors,
  userRole,
  onClose,
  selectedService,
  users,
}) => {
  const [formValues, setFormValues] = useState(formData);

  useEffect(() => {
    if (selectedService) {
      setFormData({
        title: selectedService.itemName,
        description: selectedService.description,
        deadline: "",
        customerComments: "",
        assignedTo: "",
        predefinedServices: selectedService.itemName,
        attachments: "",
      });
    }
  }, [selectedService]);

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData(formValues);
    onSubmit(formValues);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      {userRole && (
        <>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleInputChange}
            className={`border p-2 mb-2 w-full ${
              fieldErrors.title ? "border-red-500" : ""
            }`}
          />
          {fieldErrors.title && (
            <p className="text-red-500 text-sm mb-2">Title is required.</p>
          )}

          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formValues.description}
            onChange={handleInputChange}
            className={`border p-2 mb-2 w-full ${
              fieldErrors.description ? "border-red-500" : ""
            }`}
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-sm mb-2">
              Description is required.
            </p>
          )}

          <label className="block mb-1">Deadline</label>
          <DatePicker
            selected={formValues.deadline}
            onChange={(date) =>
              setFormValues({ ...formValues, deadline: date })
            }
            minDate={new Date()}
            className={`border p-2 mb-2 w-full ${
              fieldErrors.deadline ? "border-red-500" : ""
            }`}
          />
          {fieldErrors.deadline && (
            <p className="text-red-500 text-sm mb-2"> Deadline is required.</p>
          )}

          {(() => {
            switch (userRole) {
              case "admin":
              case "manager":
                return (
                  <>
                    <label className="block mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formValues.priority}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <label className="block mb-1">Status</label>
                    <select
                      name="status"
                      value={formValues.status}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <label className="block mb-1">Assigned To</label>
                    <select
  name="assignedTo"
  value={formValues.assignedTo}
  onChange={handleInputChange}
  className="border p-2 mb-2 w-full"
>
  <option value="">Select User</option>
  {users.map((user) => (
    <option key={user._id} value={user._id}>
      {user.username}
    </option>
  ))}
</select>

                    <label className="block mb-1">Resources</label>
                    <input
                      type="text"
                      name="resources"
                      value={formValues.resources}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    />

                    <label className="block mb-1">Internal Comments</label>
                    <textarea
                      name="internalComments"
                      value={formValues.internalComments}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    />
                  </>
                );

              case "employee":
                return (
                  <>
                    <label className="block mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formValues.priority}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    >
                      <option value=" low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>

                    <label className="block mb-1">Status</label>
                    <select
                      name="status"
                      value={formValues.status}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>

                    <label className="block mb-1">Assigned To</label>
                    <select
  name="assignedTo"
  value={formValues.assignedTo}
  onChange={handleInputChange}
  className="border p-2 mb-2 w-full"
>
  <option value="">Select User</option>
  {users.map((user) => (
    <option key={user._id} value={user._id}>
      {user.username}
    </option>
  ))}
</select>

                    <label className="block mb-1">Resources</label>
                    <input
                      type="text"
                      name="resources"
                      value={formValues.resources}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    />

                    <label className="block mb-1">Internal Comments</label>
                    <textarea
                      name="internalComments"
                      value={formValues.internalComments}
                      onChange={handleInputChange}
                      className="border p-2 mb-2 w-full"
                    />
                  </>
                );

              case "customer":
                return null;

              default:
                return <p>You do not have permission to view this form.</p>;
            }
          })()}

          <label className="block mb-1">Customer Comments</label>
          <textarea
            name="customerComments"
            placeholder="Enter customer comments"
            value={formValues.customerComments}
            onChange={handleInputChange}
            className="border p-2 mb-2 w-full"
          />
          <p className="text-gray-500 text-sm">
            Requested on: {new Date().toLocaleString()}
          </p>

          <label className="block mb-1">Predefined Services</label>
          <input
            type="text"
            name="predefinedServices"
            value={formValues.predefinedServices}
            readOnly={userRole === "customer"}
            className={`border p-2 mb-2 w-full ${
              userRole === "customer" ? "bg-gray-200" : ""
            }`}
          />

          <label className="block mb-1">Attachments</label>
          <input
            type="file"
            name="attachments"
            onChange={(e) =>
              setFormValues({ ...formValues, attachments: e.target.files[0] })
            }
            className="border p-2 mb-2 w-full"
          />

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </>
      )}
    </form>
  );
};

export default WorkOrderForm;

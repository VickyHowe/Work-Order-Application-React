import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WorkOrderForm = ({ formData, setFormData, onSubmit, fieldErrors, userRole, onClose }) => {
    console.log("Current user role:", userRole);

    return (
        <form onSubmit={onSubmit}>
            <label className="block mb-1">Title</label>
            <input
                type="text"
                value={formData.title}
                readOnly={userRole === 'customer'} 
                className={`border p-2 mb-2 w-full ${fieldErrors.title ? "border-red-500" : ""} ${userRole === 'customer' ? "bg-gray-200" : ""}`} 
            />
            {fieldErrors.title && (
                <p className="text-red-500 text-sm mb-2">Title is required.</p>
            )}

            <label className="block mb-1">Description</label>
            <textarea
                value={formData.description}
                readOnly={userRole === 'customer'} 
                className={`border p-2 mb-2 w-full ${fieldErrors.description ? "border-red-500" : ""} ${userRole === 'customer' ? "bg-gray-200" : ""}`} 
            />
            {fieldErrors.description && (
                <p className="text-red-500 text-sm mb-2">Description is required.</p>
            )}

            <label className="block mb-1">Deadline</label>
            <DatePicker
                selected={formData.deadline ? new Date(formData.deadline) : null}
                onChange={(date) =>
                    setFormData({
                        ...formData,
                        deadline: date ? date.toISOString().split("T")[0] : null,
                    })
                }
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className={`border p-2 mb-2 w-full ${fieldErrors.deadline ? "border-red-500" : ""}`}
                placeholderText="Select a deadline"
                required
            />
            {fieldErrors.deadline && (
                <p className="text-red-500 text-sm mb-2">Deadline is required.</p>
            )}

            {userRole === 'admin' || userRole === 'manager' ? (
                <>
                    <label className="block mb-1">Priority</label>
                    <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="border p-2 mb-2 w-full"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>

                    <label className="block mb-1">Status</label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                        className={"border p-2 mb-2 w-full"}
                    >
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <label className="block mb-1">Attachments</label>
                    <input
                        type="text"
                        placeholder="Enter attachments (comma separated)"
                        value={formData.attachments}
                        onChange={(e) => setFormData({ ...formData, attachments: e.target.value })}
                        className="border p-2 mb-2 w-full"
                    />
                </>
            ) : null}

            <label className="block mb-1">Customer Comments</label>
            <textarea
                placeholder="Enter customer comments"
                value={formData.customerComments}
                onChange={(e) => setFormData({ ...formData, customerComments: e.target.value })}
                className="border p-2 mb-2 w-full"
            />
            {/* Automatically include the date requested in the customer comments */}
            <p className="text-gray-500 text-sm">Requested on: {new Date().toLocaleString()}</p>

            <label className="block mb-1">Predefined Services</label>
            <input
                type="text"
                value={formData.predefinedServices}
                readOnly={userRole === 'customer'} 
                className={`border p-2 mb-2 w-full ${userRole === 'customer' ? "bg-gray-200" : ""}`} 
            />

            <button type="submit" className="btn btn-primary">
                Submit Request
            </button>
            <button type="button" className="btn btn-secondary ml-2" onClick={onClose}>
                Cancel
            </button>
        </form>
    );
};

export default WorkOrderForm;
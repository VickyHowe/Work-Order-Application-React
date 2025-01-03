import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const WorkOrderForm = ({ formData, setFormData, onSubmit, fieldErrors }) => {
  return (
    <form onSubmit={onSubmit}>
      <label className="block mb-1">Title</label>
      <input
        type="text"
        placeholder="Enter work order title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        className={`border p-2 mb-2 w-full ${
          fieldErrors.title ? "border-red-500" : ""
        }`}
      />
      {fieldErrors.title && (
        <p className="text-red-500 text-sm mb-2">Title is required.</p>
      )}

      <label className="block mb-1">Description</label>
      <textarea
        placeholder="Enter work order description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
        className={`border p-2 mb-2 w-full ${
          fieldErrors.description ? "border-red-500" : ""
        }`}
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
  className={`border p-2 mb-2 w-full ${
    fieldErrors.deadline ? "border-red-500" : ""
  }`}
  placeholderText="Select a deadline"
/>
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

      <label className="block mb-1">Customer Comments</label>
      <textarea
        placeholder="Enter customer comments"
        value={formData.customerComments}
        onChange={(e) =>
          setFormData({ ...formData, customerComments: e.target.value })
        }
        className="border p-2 mb-2 w-full"
      />

      <label className="block mb-1">Predefined Services</label>
      <input
        type="text"
        placeholder="Enter predefined services (comma separated)"
        value={formData.predefinedServices}
        onChange={(e) =>
          setFormData({ ...formData, predefinedServices: e.target.value })
        }
        className="border p-2 mb-2 w-full"
      />

      <label className="block mb-1">Attachments</label>
      <input
        type="text"
        placeholder="Enter attachments (comma separated)"
        value={formData.attachments}
        onChange={(e) =>
          setFormData({ ...formData, attachments: e.target.value })
        }
        className="border p-2 mb-2 w-full"
      />
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
    </form>
  );
};

export default WorkOrderForm;

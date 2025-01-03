import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskForm = ({ formData, setFormData, users, onSubmit, fieldErrors }) => {
  console.log("Users in TaskForm:", users);
  return (
    <form onSubmit={onSubmit}>
      <label className="block mb-1">Task Title</label>
      <input
        type="text"
        placeholder="Enter task title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        className={`border p-2 mb-2 w-full ${fieldErrors.title ? 'border-red-500' : ''}`}
      />
      <label className="block mb-1">Description</label>
      <textarea
        placeholder="Enter task description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        className={`border p-2 mb-2 w-full ${fieldErrors.description ? 'border-red-500' : ''}`}
      />
      <label className="block mb-1">Deadline</label>
      <DatePicker
        selected={formData.deadline ? new Date(formData.deadline) : null}
        onChange={(date) => setFormData({ ...formData, deadline: date.toISOString().split("T")[0] })}
        minDate={new Date()} // Prevent selecting past dates
        dateFormat="yyyy-MM-dd"
        className={`border p-2 mb-2 w-full ${fieldErrors.deadline ? "border-red-500" : ""}`}
        placeholderText="Select a deadline"
      />
      {fieldErrors.deadline && (
        <p className="text-red-500 text-sm mb-2">Deadline is required.</p>
      )}
      <label className="block mb-1">Resources (comma separated)</label>
      <input
        type="text"
        placeholder="Enter resources (comma separated)"
        value={formData.resources}
        onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
        className="border p-2 mb-2 w-full"
      />
<label className="block mb-1">Assigned To</label>
<select
  value={formData.assignedUserId}
  onChange={(e) => {
    const selectedUserId = e.target.value;
    const selectedUser  = users.find((user) => user._id === selectedUserId);
    setFormData({
      ...formData,
      assignedUserId: selectedUserId,
      username: selectedUser  ? selectedUser .username : "",
    });
  }}
  className={`border p-2 mb-2 w-full`} // Removed fieldErrors.assignedUserId
>
  <option value="">Select User</option>
  {users.map((user) => (
    <option key={user._id} value={user._id}>
      {user.username}
    </option>
  ))}
</select>
      <label className="block mb-1">Status</label>
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="border p-2 mb-2 w-full"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </form>
  );
};

export default TaskForm;
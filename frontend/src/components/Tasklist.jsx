import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

const TaskList = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    resources: "",
    assignedUserId: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const apiCall = async (url, method = 'get', data = {}) => {
    const response = await axios({
      method,
      url: `${import.meta.env.VITE_BACKEND_URL}${url}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data,
    });
    return response.data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksData, usersData] = await Promise.all([
          apiCall('/api/tasks'),
          apiCall('/api/users/roles'),
        ]);
        setTasks(tasksData);
        
        // Filter users to include employees and managers
        const filteredUsers = usersData.filter(user => 
          user.role.name === "employee" || user.role.name === "manager"
        );
        setUsers(filteredUsers);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await apiCall(`/api/tasks/${id}`, 'delete');
    setTasks(tasks.filter((task) => task._id !== id));
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = {
        ...formData,
        resources: formData.resources.split(",").map(item => item.trim()),
        user: formData.assignedUserId,
        createdBy: user._id,
      };
      const response = await apiCall('/api/tasks', 'post', newTask);
      setTasks([...tasks, response]);
      setFormData({ title: "", description: "", deadline: "", resources: "", assignedUserId: "" });
      setShowModal(false);
    } catch {
      setError("Error creating task");
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    try {
        // Find the username based on the assigned user ID
        const assignedUser  = users.find(user => user._id === formData.assignedUserId); // Ensure this matches the select value
        const username = assignedUser  ? assignedUser.username : null;

        // Check if username is found
        if (!username) {
            setError("Assigned user not found");
            return;
        }

        const updatedTask = {
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            resources: formData.resources.split(",").map(item => item.trim()),
            username: username // Set the user to the username instead of user ID
        };

        const response = await apiCall(`/api/tasks/${currentTaskId}`, 'put', updatedTask);
        setTasks(tasks.map(task => (task._id === currentTaskId ? response : task)));
        setFormData({ title: "", description: "", deadline: "", resources: "", assignedUserId: "" }); // Reset form data
        setShowEditModal(false);
    } catch {
        setError("Error updating task");
    }
};
  const openEditModal = (task) => {
    setCurrentTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      resources: task.resources.join(", "),
      assignedUserId: task.user ? task.user._id : "",
    });
    setShowEditModal(true);
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full"
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Task Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Deadline</th>
              <th className="py-2 px-4 border-b">Resources</th>
              <th className="py-2 px-4 border-b">Assigned To</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{task.title}</td>
                <td className="py-2 px-4 border-b">{task.description}</td>
                <td className="py-2 px-4 border-b">{new Date(task.deadline).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{task.resources.join(", ")}</td>
                <td className="py-2 px-4 border-b">
                {task.user ? task.user.username : 'Unassigned'}
                </td>
                <td className="py-2 px-4 border-b">
                  {["admin", "manager"].includes(user.role) && (
                    <Button
                      onClick={() => openEditModal(task)}
                      className="bg-blue-500 text-white p-1 rounded mr-2"
                    >
                      Edit
                    </Button>
                  )}
                  {user.role !== "customer" && ( // Only show delete button for non-customers
                    <Button
                      onClick={() => handleDelete(task._id)}
                      className="bg-red text-white p-1 rounded"
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {["manager", "admin"].includes(user.role) && ( 
        <div className="mt-4">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Create New Task
          </Button>
        </div>
      )}

      {/* Modal for creating a new task */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleCreateTask}>
            <label className="block mb-1">Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
            />
            <label className="block mb-1">Description</label>
            <textarea
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
            />
            <label className="block mb-1">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
            />
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
              onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
 >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Create Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for editing a task */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditTask}>
            <label className="block mb-1">Task Title</label>
            <input
              type="text"
              placeholder="Enter task title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
            />
            <label className="block mb-1">Description</label>
            <textarea
              placeholder="Enter task description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
            />
            <label className="block mb-1">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              className="border p-2 mb-2 w-full"
            />
            <label className="block mb-1">Resources (comma separated)</label>
            <input
              type="text"
              placeholder="Enter resources (comma separated)"
              value={formData.resources}
              onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              className="border p-2 mb-2 w-full"
            />
            {["admin", "manager"].includes(user.role) && (
              <>
                <label className="block mb-1">Assigned To</label>
                <select
                  value={formData.assignedUserId}
                  onChange={(e) => setFormData({ ...formData, assignedUserId: e.target.value })}
                  required
                  className="border p-2 mb-2 w-full"
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.username}
                    </option>
                  ))}
                </select>
              </>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );

};

export default TaskList;
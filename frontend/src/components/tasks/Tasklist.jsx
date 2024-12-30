import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useTasks from "../../hooks/useTasks";
import TaskForm from "./TaskForm";
import TaskDetails from "./TaskDetails";
import useApi from "../../hooks/useApi";

const TaskList = ({ user }) => {
  const { tasks, loading, error, createTask, updateTask, deleteTask } =
    useTasks();
  const { apiCall } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    resources: "",
    assignedUserId: "",
    status: "pending",
  });

  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    description: false,
    deadline: false,
    assignedUserId: false,
});

  const [users, setUsers] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await apiCall("/api/users/roles");
        const filteredUsers = usersData.filter(
          (user) =>
            user.role.name === "employee" || user.role.name === "manager"
        );
        setUsers(filteredUsers);
        console.log("Fetched users:", filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateTask = async () => {
    const errors = {
        title: !formData.title,
        description: !formData.description,
        deadline: !formData.deadline,
        assignedUserId: !formData.assignedUserId,
    };
    
    setFieldErrors(errors);

    if (Object.values(errors).some((error) => error)) {
        setErrorMessage("Please fill in all fields.");
        return;
    }
    setErrorMessage(""); 
    await createTask(formData);
    setShowModal(false);
    setFormData({
        title: "",
        description: "",
        deadline: "",
        resources: "",
        assignedUserId: "",
        status: "pending",
    });
};

  const openEditModal = (task) => {
    console.log("Selected task:", task);
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      resources: task.resources.join(", "),
      assignedUserId: task.user ? task.user._id : "", 
      status: task.status,
      username: task.user ? task.user.username : "", 
    });
    setShowModal(true);
  };

  const handleEditTask = async () => {
    const errors = {
        title: !formData.title,
        description: !formData.description,
        deadline: !formData.deadline,
        assignedUserId: !formData.assignedUserId,
    };
    
    setFieldErrors(errors);

    if (Object.values(errors).some((error) => error)) {
        setErrorMessage("Please fill in all fields.");
        return;
    }
    setErrorMessage(""); // Clear error message
    try {
        console.log("Form data being sent:", formData);
        console.log("Updating task with ID:", selectedTask._id);
        await updateTask(selectedTask._id, formData);
        setShowModal(false);
        setFormData({
            title: "",
            description: "",
            deadline: "",
            resources: "",
            assignedUserId: "",
            status: "pending",
        });
      } catch (error) {
        console.error("Error updating task:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
};

  const toggleTaskStatus = async (task) => {
    const newStatus =
      task.status === "pending"
        ? "in progress"
        : task.status === "in progress"
        ? "completed"
        : "pending";
    await updateTask(task._id, { ...task, status: newStatus });
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (showCompleted || task.status === "pending" || task.status === "in-progress")
  );
  return (
    <div className="mx-auto mt-10 p-6 bg-forms text-black border-gray rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {loading && <p>Loading tasks...</p>}
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 w-full rounded-md "
      />
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={showCompleted}
          onChange={() => setShowCompleted(!showCompleted)}
          className="mr-2"
        />
        Show Completed Tasks
      </label>
      {/* Table for tasks */}
      <div className="overflow-x-auto flex">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="border p-2 mb-4 w-full rounded-md">
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">Task Title</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Deadline</th>
              <th className="py-2 px-4 border-b">Resources</th>
              <th className="py-2 px-4 border-b">Assigned To</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{task.title}</td>
                <td className="py-2 px-4 border-b">{task.description}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(task.deadline).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {task.resources.join(",")}
                </td>
                <td className="py-2 px-4 border-b">
                  {task.user ? task.user.username : "Unassigned"}
                </td>
                <td className="py-2 px-4 border-b">
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className={`p-2 rounded ${
                    task.status === "completed"
                      ? "bg-green-500"
                      : "bg-yellow-500"
                  } text-white`}
                >
                  {task.status}
                </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openDetailsModal(task)}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => openEditModal(task)}
                    className="bg-yellow-500 text-white p-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Add Task
      </button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="bg-forms text-black">
          <Modal.Title>{selectedTask ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-black">
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            users={users}
            onSubmit={selectedTask ? handleEditTask : handleCreateTask}
            fieldErrors={fieldErrors}
          />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer className="bg-forms text-black">
          <button
            onClick={() => setShowModal(false)}
            className="bg-gray-300 text-black p-2 rounded"
          >
            Close
          </button>
          <button
            onClick={selectedTask ? handleEditTask : handleCreateTask}
            className="bg-green-500 text-white p-2 rounded"
          >
            {selectedTask ? "Save Changes" : "Add Task"}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Task Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton className="bg-forms text-black">
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-black">
          <TaskDetails
            task={selectedTask}
            onClose={() => setShowDetailsModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskList;

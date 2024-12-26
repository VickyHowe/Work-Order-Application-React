// src/components/tasks/TaskList.js
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import useTasks from "../../hooks/useTasks"; // Import the custom hook for tasks
import TaskForm from "./TaskForm"; // Import the TaskForm component
import TaskDetails from "./TaskDetails"; // Import the TaskDetails component

const TaskList = ({ user }) => {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks(); // Use the custom hook
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    resources: "",
    assignedUserId: "",
  });
  const [users, setUsers] = useState([]); // State to hold users for assignment

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await apiCall("/api/users/roles");
        const filteredUsers = usersData.filter(user => 
          user.role.name === "employee" || user.role.name === "manager"
        );
        setUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateTask = async () => {
    await createTask(formData);
    setShowModal(false);
    setFormData({ title: "", description: "", deadline: "", resources: "", assignedUserId: "" });
  };

  const handleEditTask = async (task) => {
    await updateTask(task._id, formData);
    setShowModal(false);
    setFormData({ title: "", description: "", deadline: "", resources: "", assignedUserId: "" });
  };

  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  return (
    <div className="mx-auto mt-10 p-6 bg-forms text-black border-gray rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {loading && <p>Loading tasks...</p>}
      {error && <p>{error}</p>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id} onClick={() => openDetailsModal(task)}>
            {task.title}
          </li>
        ))}
      </ul>
      <button onClick={() => setShowModal(true)}>Add Task</button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm formData={formData} setFormData={setFormData} users={users} onSubmit={handleCreateTask} />
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowModal(false)}>Close</button>
        </Modal.Footer>
      </Modal>

      {/* Task Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskDetails task={selectedTask} onClose={() => setShowDetailsModal(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskList;
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown, FaEye, FaEdit, FaTrash, FaUserTimes, FaCheckCircle, FaSpinner, FaHourglassHalf } from "react-icons/fa";
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
  const [sortConfig, setSortConfig] = useState({
    key: "title",
    direction: "ascending",
  });

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
    };
  
    setFieldErrors(errors);
  
    if (Object.values(errors).some((error) => error)) {
      setErrorMessage("Please fill in all fields.");
      return;
    }
    setErrorMessage("");
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


  const openDetailsModal = (task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredTasks = sortedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(search.toLowerCase()) &&
      (showCompleted ||
        task.status === "pending" ||
        task.status === "in-progress")
  );

  return (
    <div className="mx-auto mt-10 p-6 bg-forms text-black border-gray rounded-lg shadow-md w-full sm:max-w-md md:max-w-lg lg:max-w-4xl">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white p-2 rounded mt-4"
      >
        Add Task
      </button>
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
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Task Title{" "}
                {sortConfig.key === "title" ? (
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("description")}
              >
                Description{" "}
                {sortConfig.key === "description" ? (
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("deadline")}
              >
                Deadline{" "}
                {sortConfig.key === "deadline" ? (
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("assignedUserId")}
              >
                Assigned To{" "}
                {sortConfig.key === "assignedUserId" ? (
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Status{" "}
                {sortConfig.key === "status" ? (
                  sortConfig.direction === "ascending" ? (
                    <FaSortUp />
                  ) : (
                    <FaSortDown />
                  )
                ) : (
                  <FaSort />
                )}
              </th>
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
    {task.user ? (
        task.user.username
    ) : (
        <span className="flex items-center">
            <FaUserTimes className="mr-1" /> Unassigned
        </span>
    )}
</td>
<td className="py-2 px-4 border-b">
    {task.status === "completed" ? (
        <span className="flex items-center text-green-500">
            <FaCheckCircle className="mr-1" /> Completed
        </span>
    ) : task.status === "in-progress" ? (
        <span className="flex items-center text-yellow-500">
            <FaSpinner className="mr-1 animate-spin" /> In Progress
        </span>
    ) : (
        <span className="flex items-center text-gray-500">
            <FaHourglassHalf className="mr-1" /> Pending
        </span>
    )}
</td>
                <td className="py-2 px-4 border-b">
    <button
        onClick={() => openDetailsModal(task)}
        className="bg-forms text-black p-2 rounded mr-2 flex items-center"
    >
        <FaEye className="mr-1" /> {/* Eye icon for details */}
        Details
    </button>
    <button
        onClick={() => openEditModal(task)}
        className="bg-navbar text-black p-2 rounded flex items-center"
    >
        <FaEdit className="mr-1" /> {/* Edit icon for editing */}
        Edit
    </button>
    <button
        onClick={() => {
            if (window.confirm("Are you sure you want to delete this task?")) {
                deleteTask(task._id);
            }
        }}
        className="bg-red-500 text-white p-2 rounded flex items-center"
    >
        <FaTrash className="mr-1" /> {/* Trash icon for deleting */}
        Delete
    </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

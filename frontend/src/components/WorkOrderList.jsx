import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Button, Modal, Spinner } from "react-bootstrap";
import Calendar from "react-calendar";
import {
  FaEye,
  FaPlus,
  FaTrash,
  FaSave,
  FaSortDown,
  FaSortUp,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"; // Import icons
import useFetchWorkOrders from "./useFetchWorkOrders"; // Import the custom hook
import axios from "axios";

const WorkOrderList = ({ user, selectedOrder, setSelectedOrder }) => {
  const token = localStorage.getItem("token");
  const { workOrders, setWorkOrders, loading, error, fetchWorkOrders } =
    useFetchWorkOrders(token); // Get setWorkOrders from the hook
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [localSelectedOrder, setLocalSelectedOrder] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "",
    priority: "medium",
  });

  useEffect(() => {
    if (selectedOrder) {
      console.log("Selected Order:", selectedOrder);
      const deadline = selectedOrder.start
        ? new Date(selectedOrder.start)
        : new Date(); // Use start as the deadline
      setLocalSelectedOrder({
        ...selectedOrder,
        _id: selectedOrder._id, // Ensure the ID is set correctly
        deadline: deadline, // Ensure deadline is a Date object
      });
      setShowModal(true);
      setShowCalendar(true);
    } else {
      console.log("No selected order."); // Log if no order is selected
    }
  }, [selectedOrder]); // Only depend on selectedOrder

  const filteredData = useMemo(() => {
    return workOrders.filter((order) => {
      const title = order.title?.toLowerCase() || "";
      const status = order.status?.toLowerCase() || "";
      return (
        title.includes(filterText.toLowerCase()) ||
        status.includes(filterText.toLowerCase())
      );
    });
  }, [workOrders, filterText]);

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        sortType: "basic",
      },
      {
        Header: "Deadline",
        accessor: "deadline",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
        sortType: "basic",
      },
      {
        Header: "Status",
        accessor: "status",
        sortType: "basic",
      },
      {
        Header: "Priority",
        accessor: "priority",
        sortType: "basic",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <Button variant="primary" onClick={() => handleShow(row.original)}>
            <FaEye />
          </Button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    previousPage,
    nextPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: filteredData, // Ensure this is set to filteredData
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  const handleShow = (order) => {
    if (order) {
      const deadline = order.start ? new Date(order.start) : new Date(); // Use order.start as the deadline
      console.log("Order Deadline:", order.start); // Log the original deadline
      console.log("Parsed Deadline:", deadline); // Log the parsed deadline
      console.log("Order ID:", order._id); // Log the order ID

      setLocalSelectedOrder({
        ...order,
        _id: order._id, // Ensure the ID is set correctly
        deadline: deadline, // Ensure deadline is a Date object
      });
      setShowModal(true);
      setShowCalendar(true);
    }
  };
  const handleClose = () => {
    setShowModal(false);
    setShowCalendar(false);
    setLocalSelectedOrder(null);
    setSelectedOrder(null); // Reset selected order for calendar view
    setNewOrder({
      title: "",
      description: "",
      deadline: "",
      status: "",
      priority: "medium",
    });
  };

  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/workorders/request`,
        newOrder,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update work orders with the new order
      setWorkOrders((prevOrders) => [...prevOrders, response.data]);
      await fetchWorkOrders(); // Re-fetch work orders after creating
      handleClose(); // Close the modal after creating
    } catch (error) {
      console.error("Error creating work order:", error);
    }
  };

  const handleUpdateOrder = async () => {
    if (!localSelectedOrder || !localSelectedOrder._id) {
      console.error("No order selected or order ID is missing.");
      return; // Prevent further execution if there's no valid order
    }

    const payload = {
      _id: localSelectedOrder._id,
      title: localSelectedOrder.title,
      description: localSelectedOrder.description,
      deadline: localSelectedOrder.deadline.toISOString(),
      status: localSelectedOrder.status,
      priority: localSelectedOrder.priority,
      internalComments: localSelectedOrder.internalComments || [],
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/workorders/${
          localSelectedOrder._id
        }`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update work orders in the list view
      setWorkOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === response.data._id ? response.data : order
        )
      );

      await fetchWorkOrders(); // Re-fetch work orders after updating
      handleClose(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating work order:", error);
    }
  };

  const handleDeleteOrder = async () => {
    if (!localSelectedOrder || !localSelectedOrder._id) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/workorders/${
          localSelectedOrder._id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update work orders by filtering out the deleted order
      setWorkOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== localSelectedOrder._id)
      );
      await fetchWorkOrders(); // Re-fetch work orders after deleting
      handleClose(); // Close the modal after deleting
    } catch (error) {
      console.error("Error deleting work order:", error);
    }
  };
  return (
    <div>
      <h1>Work Orders</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <label htmlFor="title" className="form-label">
            Filter by title or status
          </label>
          <input
            type="text"
            className="bg-gray-200 pl-5"
            placeholder="Filter by title or status"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-secondary"
          >
            <FaPlus /> Create New Work Order
          </Button>
          <div className="pagination">
            <Button onClick={previousPage} disabled={!canPreviousPage}>
              <FaChevronLeft /> Previous
            </Button>
            <span>
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <Button onClick={nextPage} disabled={!canNextPage}>
              Next <FaChevronRight />
            </Button>
          </div>
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => {
                    const columnProps = column.getHeaderProps(
                      column.getSortByToggleProps()
                    );
                    return (
                      <th {...columnProps} key={columnProps.key}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FaSortDown />
                            ) : (
                              <FaSortUp />
                            )
                          ) : (
                            <FaSortDown />
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
<tbody {...getTableBodyProps()}>
  {page.map((row) => {
    prepareRow(row);
    const rowProps = row.getRowProps();
    return (
      <tr {...rowProps} key={row.original._id}>
        {row.cells.map((cell) => {
          const cellProps = cell.getCellProps();
          return (
            <td {...cellProps} key={`${row.original._id}-${cell.column.id}`}>
              {cell.render("Cell")}
            </td>
          );
        })}
      </tr>
    );
  })}
</tbody>
          </table>
          {showCalendar && localSelectedOrder && (
            <Calendar
              onChange={setLocalSelectedOrder}
              value={
                localSelectedOrder.deadline
                  ? new Date(localSelectedOrder.deadline)
                  : new Date()
              } // Fallback to current date
            />
          )}
        </>
      )}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {user.role === "customer" ? "View Work Order" : "Edit Work Order"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {localSelectedOrder ? (
            <>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter work order title"
                  value={localSelectedOrder.title}
                  onChange={(e) =>
                    setLocalSelectedOrder({
                      ...localSelectedOrder,
                      title: e.target.value,
                    })
                  }
                  className="form-control"
                  readOnly={user.role === "customer"}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter work order description"
                  value={localSelectedOrder.description}
                  onChange={(e) =>
                    setLocalSelectedOrder({
                      ...localSelectedOrder,
                      description: e.target.value,
                    })
                  }
                  className="form-control"
                  readOnly={user.role === "customer"}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="deadline" className="form-label">
                  Deadline
                </label>
                <input
                  type="date"
                  id="deadline"
                  value={
                    localSelectedOrder.deadline
                      ? localSelectedOrder.deadline.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setLocalSelectedOrder({
                      ...localSelectedOrder,
                      deadline: new Date(e.target.value),
                    })
                  }
                  className="form-control"
                  readOnly={user.role === "customer"}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="priority" className="form-label">
                  Priority
                </label>
                <select
                  id="priority"
                  value={localSelectedOrder.priority}
                  onChange={(e) =>
                    setLocalSelectedOrder({
                      ...localSelectedOrder,
                      priority: e.target.value,
                    })
                  }
                  className="form-select"
                  disabled={user.role === "customer"}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </>
          ) : (
            <p>No order selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {user.role !== "customer" && localSelectedOrder && (
            <>
              <Button variant="danger" onClick={handleDeleteOrder}>
                <FaTrash /> Delete Work Order
              </Button>
              <Button variant="primary" onClick={handleUpdateOrder}>
                <FaSave /> Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Work Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="newTitle" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="newTitle"
              placeholder="Enter work order title"
              value={newOrder.title}
              onChange={(e) =>
                setNewOrder({ ...newOrder, title: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newDescription" className="form-label">
              Description
            </label>
            <textarea
              id="newDescription"
              placeholder="Enter work order description"
              value={newOrder.description}
              onChange={(e) =>
                setNewOrder({ ...newOrder, description: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newDeadline" className="form-label">
              Deadline
            </label>
            <input
              type="date"
              id="newDeadline"
              value={newOrder.deadline}
              onChange={(e) =>
                setNewOrder({ ...newOrder, deadline: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPriority" className="form-label">
              Priority
            </label>
            <select
              id="newPriority"
              value={newOrder.priority}
              onChange={(e) =>
                setNewOrder({ ...newOrder, priority: e.target.value })
              }
              className="form-select"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateOrder}>
            <FaSave /> Create Work Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkOrderList;

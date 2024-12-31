import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { Modal, Spinner } from "react-bootstrap";
import useApi from "../../hooks/useApi"; 
import TaskForm from "../tasks/TaskForm";
import { FaEye, FaTrash, FaSave, FaSortDown, FaSortUp } from "react-icons/fa";

const WorkOrderList = ({ user }) => {
  const token = localStorage.getItem("token");
  const { apiCall } = useApi(); 
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "",
    priority: "medium",
  });

  useEffect(() => {
    const fetchWorkOrders = async () => {
      setLoading(true);
      try {
        const data = await apiCall("/api/workorders");
        setWorkOrders(data);
      } catch (error) {
        console.error("Error fetching work orders:", error);
        setError("Error fetching work orders");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, [apiCall]);

  const handleCreateOrder = async () => {
    try {
      const response = await apiCall("/api/workorders/request", "post", newOrder);
      setWorkOrders((prevOrders) => [...prevOrders, response]);
      setShowCreateModal(false);
      setNewOrder({ title: "", description: "", deadline: "", status: "", priority: "medium" });
    } catch (error) {
      console.error("Error creating work order:", error);
      setError("Error creating work order");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await apiCall(`/api/workorders/${orderId}`, "delete");
      setWorkOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error deleting work order:", error);
      setError("Error deleting work order");
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Deadline",
        accessor: "deadline",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="bg-forms text-black px-3 py-1 rounded flex items-center"
              onClick={() => setSelectedOrder(row.original)}
            >
              <FaEye className="mr-1" /> View
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded flex items-center"
              onClick={() => handleDeleteOrder(row.original._id)}
            >
              <FaTrash className="mr-1" /> Delete
            </button>
          </div>
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
      data: workOrders,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      <h1>Work Orders</h1>
      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} key={column.id}>
                      {column.render("Header")}
                      <span>
                        {column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : ""}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
  {page.map((row) => {
    prepareRow(row);
    return (
      <tr {...row.getRowProps()} key={row.original._id}> {/* Add key here */}
        {row.cells.map((cell) => (
          <td {...cell.getCellProps()} key={cell.column.id}> {/* Add key here */}
            {cell.render("Cell")}
          </td>
        ))}
      </tr>
    );
  })}
</tbody>
          </table>
        </>
      )}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Work Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm formData={newOrder} setFormData={setNewOrder} onSubmit={handleCreateOrder} />
        </Modal.Body>
        <Modal.Footer>
          <button className="bg-gray-300 text-black px-3 py-1 rounded" onClick={() => setShowCreateModal(false)}>
            Close
          </button>
          <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleCreateOrder}>
            <FaSave /> Create Work Order
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkOrderList;
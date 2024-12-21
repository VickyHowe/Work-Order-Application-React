import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useTable, useSortBy, usePagination } from "react-table";
import { Button, Modal, Spinner } from "react-bootstrap";

const WorkOrderList = ({ user }) => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/workorders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setWorkOrders(response.data);
      } catch (error) {
        setError("Error fetching work orders");
        console.error("Error fetching work orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrders();
  }, []); // Empty dependency array to run only once

  const filteredData = useMemo(() => {
    return workOrders.filter(
      (order) =>
        order.title.toLowerCase().includes(filterText.toLowerCase()) ||
        order.status.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [workOrders, filterText]); // Memoize filtered data

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "_id" },
      { Header: "Title", accessor: "title" },
      {
        Header: "Deadline",
        accessor: "deadline",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      { Header: "Status", accessor: "status" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <Button variant="primary" onClick={() => handleShow(row.original)}>
            View
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
    gotoPage,
    nextPage,
    previousPage,
  } = useTable(
    {
      columns,
      data: filteredData, // Use memoized filtered data
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  const handleShow = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading)
    return <Spinner animation="border" className="d-block mx-auto" />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl mb-4">Work Orders</h2>
      <input
        type="text"
        placeholder="Search by title or status..."
        onChange={(e) => setFilterText(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <table
        {...getTableProps()}
        className="min-w-full bg-white border border-gray-300"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-200">
              {headerGroup.headers.map((column) => {
                const { key, ...columnProps } = column.getHeaderProps(
                  column.getSortByToggleProps()
                );
                return (
                  <th key={key} {...columnProps} className="py-2 px-4 border-b">
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
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
            return (
              <tr {...row.getRowProps()} className="hover:bg-gray-100">
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className="py-2 px-4 border-b">
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4">
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </Button>{" "}
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </Button>{" "}
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </Button>{" "}
        <Button
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </Button>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Work Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <h4>{selectedOrder.title}</h4>
              <p>
                <strong>Deadline:</strong>{" "}
                {new Date(selectedOrder.deadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              {/* Add more details as needed */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkOrderList;

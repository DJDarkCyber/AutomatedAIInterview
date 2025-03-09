import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form, Accordion } from "react-bootstrap";
import axios from "axios";
import Header from "./Header";

const Dashboard = () => {
  const [employers, setEmployers] = useState([]); // State to store employer data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [showEditModal, setShowEditModal] = useState(false); // Edit modal visibility
  const [selectedEmployer, setSelectedEmployer] = useState(null); // Selected employer for editing
  const [updatedData, setUpdatedData] = useState({}); // Updated employer data
  const [showChatModal, setShowChatModal] = useState(false); // Chat modal visibility
  const [chatLogs, setChatLogs] = useState([]); // Chat logs for the selected employer

  // Fetch employer data from the API using Axios

  const fetchEmployers = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get("http://127.0.0.1:8000/api/employer/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setEmployers(response.data); // Set the fetched data
    } catch (err) {
      setError(err.message); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  // Handle Edit button click
  const handleEdit = (employer) => {
    setSelectedEmployer(employer);
    setUpdatedData(employer); // Initialize updated data with the selected employer's data
    setShowEditModal(true);
  };

  // Handle Delete button click
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employer?")) {
      try {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const accessToken = authData?.access;

        if (!accessToken) {
          throw new Error("No access token found");
        }

        await axios.delete(`http://127.0.0.1:8000/api/employer/${id}/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Refresh the employer list after deletion
        fetchEmployers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Handle View button click
  const handleView = async (id) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Fetch chat logs for the selected employer
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ai_interview/chatlog/?employer_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setChatLogs(response.data); // Set the fetched chat logs
      setShowChatModal(true); // Open the chat modal
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      await axios.patch(
        `http://127.0.0.1:8000/api/employer/${selectedEmployer.id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Refresh the employer list after editing
      fetchEmployers();
      setShowEditModal(false); // Close the modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <Header onEmployerCreated={fetchEmployers} />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Scheduled Interviews
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 mb-4">
          Error: {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <Table striped bordered hover className="bg-white shadow-sm rounded-lg">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Field of Interview</th>
              <th>Interview Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employers.map((employer, index) => (
              <tr key={employer.id}>
                <td>{index + 1}</td>
                <td>{`${employer.first_name} ${employer.last_name}`}</td>
                <td>{employer.field_of_interview}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      employer.interview_status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : employer.interview_status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {employer.interview_status}
                  </span>
                </td>
                <td>{new Date(employer.created_at).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEdit(employer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleDelete(employer.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleView(employer.id)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedData.first_name || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, first_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedData.last_name || ""}
                onChange={(e) =>
                  setUpdatedData({ ...updatedData, last_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Field of Interview</Form.Label>
              <Form.Control
                type="text"
                value={updatedData.field_of_interview || ""}
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    field_of_interview: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interview Status</Form.Label>
              <Form.Control
                as="select"
                value={updatedData.interview_status || ""}
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    interview_status: e.target.value,
                  })
                }
              >
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Chat Logs Modal */}
      <Modal
        show={showChatModal}
        onHide={() => setShowChatModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chat Logs</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {chatLogs.length > 0 ? (
            <Accordion>
              {chatLogs.map((log, index) => (
                <Accordion.Item key={index} eventKey={index.toString()}>
                  <Accordion.Header>
                    Chat Log #{index + 1} - {new Date(log.timestamp).toLocaleString()}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p><strong>User:</strong> {log.user_chat}</p>
                    <p><strong>AI:</strong> {log.ai_chat}</p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          ) : (
            <p>No chat logs found for this employer.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from "react";
import { Table, Button, Spinner, Modal, Form, Accordion } from "react-bootstrap";
import axios from "axios";
import Header from "./Header";

const Dashboard = () => {

  document.title = "AI Interview | Dashboard"

  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [updatedData, setUpdatedData] = useState({}); 
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatLogs, setChatLogs] = useState([]);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [employerScores, setEmployerScores] = useState(null);

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

      setEmployers(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  const handleEdit = (employer) => {
    setSelectedEmployer(employer);
    setUpdatedData(employer);
    setShowEditModal(true);
  };

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

        fetchEmployers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleView = async (id) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/ai_interview/chatlog/?employer_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setChatLogs(response.data);
      setShowChatModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewScore = async (id) => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const accessToken = authData?.access;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/employer/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setEmployerScores(response.data);
      setShowScoreModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

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

      fetchEmployers();
      setShowEditModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onEmployerCreated={fetchEmployers} />
      <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Scheduled Interviews
      </h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <Table striped bordered hover className="bg-white shadow-sm rounded-lg p-1">
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
                <td className="flex align-middle justify-center text-center items-center gap-3">
                  <Button
                    variant="info"
                    size="sm"
                    style={{'borderRadius': '10px'}}
                    className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                    onClick={() => handleEdit(employer)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    style={{'borderRadius': '10px'}}
                    className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                    onClick={() => handleDelete(employer.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    style={{'borderRadius': '10px'}}
                    className="rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                    onClick={() => handleView(employer.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    style={{'borderRadius': '10px'}}
                    className="rounded-md bg-amber-600 py-2 px-4 border border-transparent text-center text-sm text-slate-800 transition-all shadow-md hover:shadow-lg focus:bg-amber-700 focus:shadow-none active:bg-amber-700 hover:bg-amber-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                    onClick={() => handleViewScore(employer.id)}
                  >
                    View Score
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

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
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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

      <Modal
        show={showScoreModal}
        onHide={() => setShowScoreModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Employer Scores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {employerScores ? (
            <div>
              <p><strong>Name:</strong> {`${employerScores.first_name} ${employerScores.last_name}`}</p>
              <p><strong>Field of Interview:</strong> {employerScores.field_of_interview}</p>
              <p><strong>Programming Skill:</strong> {employerScores.programming_skill}</p>
              <p><strong>Logical Thinking:</strong> {employerScores.logical_thinking}</p>
              <p><strong>Case Study:</strong> {employerScores.case_study}</p>
              <p><strong>Communication Skill:</strong> {employerScores.communication_skill}</p>
              <p><strong>Problem Solving:</strong> {employerScores.problem_solving}</p>
              <p><strong>Overall Score:</strong> {employerScores.overall_score}</p>
            </div>
          ) : (
            <p>No scores found for this employer.</p>
          )}
        </Modal.Body>
      </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
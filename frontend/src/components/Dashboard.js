import React, { useState } from "react";
import axios from "axios";
import ReportTable from "./ReportTable";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:4000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReport(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to upload file");
    }
  };

  const handleSelectWinner = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/select-winner", {
        candidates: report,
      });
      setSelectedWinner(response.data.winner);
      setError("");
    } catch (err) {
      setError("No more new winners or error");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow">
        <h2 className="mb-4 text-center">Admin Dashboard</h2>

        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="d-flex gap-2 mb-4">
          <button className="btn btn-success" onClick={handleFileUpload}>
            Upload CSV
          </button>
          <button className="btn btn-primary" onClick={handleSelectWinner}>
            Select Winner
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {selectedWinner && (
          <div className="alert alert-success">
            <strong>Selected Winner:</strong> {selectedWinner.name}
          </div>
        )}

        <ReportTable data={report} />
      </div>
    </div>
  );
}

export default Dashboard;

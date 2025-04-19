import React, { useState } from "react";
import axios from "axios";
import ReportTable from "./ReportTable";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState([]);
  const [showWinnerList,setShowWinnerList] = useState(false);
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
      console.log(response.data)
      setSelectedWinner(response.data);
      setShowWinnerList(true);
      setError("");
    } catch (err) {
      setError("No more new winners or error");
    }
  };
  console.log(report, selectedWinner)
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
          <button className="btn btn-success" onClick={handleFileUpload} disabled={!file ? true : false}>
            Upload CSV
          </button>
          {report.length > 0 ? (
  !showWinnerList ? (
    <button className="btn btn-primary" onClick={handleSelectWinner}>
      Selected Winner List
    </button>
  ) : (
    <button className="btn btn-secondary" onClick={() => {
      setShowWinnerList(false);
      setSelectedWinner(null); 
    }}>
      Close Winner List
    </button>
  )
) : null}

        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <ReportTable data={selectedWinner ? selectedWinner : report} />
      </div>
    </div>
  );
}

export default Dashboard;

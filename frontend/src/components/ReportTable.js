import React, { useState } from "react";
import axios from "axios";

function ReportTable({ data }) {
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [loadingEmail, setLoadingEmail] = useState("");

  const headers = data.length ? Object.keys(data[0]) : [];

  const handleWinnerClick = async (row) => {
    setLoadingEmail(row.email);
    try {
      const response = await axios.post("http://localhost:4000/api/save-winner", row);
      if (response.data.success) {
        setSelectedWinners((prev) => [...prev, row.email]);
      } else {
        alert(response.data.message || "Could not select winner.");
      }
    } catch (error) {
      console.error("Error saving winner:", error);
      alert("Error saving winner. Maybe already selected?");
    } finally {
      setLoadingEmail("");
    }
  };

  return (
    <div className="table-responsive mt-4">
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const isSelected = selectedWinners.includes(row.email);
            return (
              <tr key={idx}>
                {headers.map((header, hIdx) => (
                  <td key={hIdx}>{row[header]}</td>
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    disabled={isSelected || loadingEmail === row.email}
                    onClick={() => handleWinnerClick(row)}
                  >
                    {isSelected ? "Selected" : loadingEmail === row.email ? "Selecting..." : "Winner"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;

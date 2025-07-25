import React from "react";

const StatsSummary = ({ totalUploads, totalDownloads }) => {
  return (
    <div className="stats shadow w-full bg-base-100">
      <div className="stat">
        <div className="stat-title">Total Uploads</div>
        <div className="stat-value text-primary">{totalUploads ?? 0}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Total Downloads</div>
        <div className="stat-value text-secondary">{totalDownloads ?? 0}</div>
      </div>
    </div>
  );
};

export default StatsSummary;

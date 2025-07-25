import React from "react";

const StatsSummary = ({ totalUploads, totalDownloads }) => {
  return (
    <div className="w-full bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-2xl shadow-2xl p-6 border border-purple-700/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-600/30">
          <div className="text-purple-200 text-sm font-medium mb-2 tracking-wide uppercase">
            Total Uploads
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white mb-1">
            {totalUploads ?? 0}
          </div>
          <div className="h-1 w-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-purple-600/30">
          <div className="text-purple-200 text-sm font-medium mb-2 tracking-wide uppercase">
            Total Downloads
          </div>
          <div className="text-4xl md:text-5xl font-bold text-white mb-1">
            {totalDownloads ?? 0}
          </div>
          <div className="h-1 w-12 bg-gradient-to-r from-indigo-400 to-cyan-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
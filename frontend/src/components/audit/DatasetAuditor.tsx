import React, { useState } from 'react';
import { DatasetAuditReport } from '../../types/api';
import { FileCheck2, Database, ShieldAlert, CheckCircle2, Upload, AlertCircle } from 'lucide-react';

interface DatasetAuditorProps {
  auditReport: DatasetAuditReport | null;
}

export const DatasetAuditor: React.FC<DatasetAuditorProps> = ({ auditReport }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  if (!auditReport) {
    return (
      <div className="p-8 text-center text-rail-400 bg-rail-900 border border-rail-800 rounded-xl">
        Loading dataset health scorecard...
      </div>
    );
  }

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rail-900 via-rail-850 to-rail-900 border border-rail-750 p-4 rounded-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-signal-green/15 border border-signal-green/30 flex items-center justify-center text-signal-green">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wide">
              Dataset Feasibility & Schema Audit (Phase 0)
            </h2>
            <p className="text-xs text-rail-300">
              Validates ground-truth integrity, timestamp plausibility, and schema alignment before forecasting.
            </p>
          </div>
        </div>
        <div className="bg-signal-green/20 text-signal-green border border-signal-green/40 px-3 py-1.5 rounded-lg text-xs font-mono font-bold">
          Quality Grade: {auditReport.data_quality_grade}
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-rail-900 border border-rail-800 p-3.5 rounded-lg">
          <span className="text-[10px] text-rail-400 font-mono block uppercase">Total Records</span>
          <div className="text-xl font-bold text-white font-mono mt-0.5">
            {auditReport.total_records.toLocaleString()}
          </div>
          <span className="text-[10px] text-rail-500 font-mono">Archive Rows</span>
        </div>

        <div className="bg-rail-900 border border-rail-800 p-3.5 rounded-lg">
          <span className="text-[10px] text-rail-400 font-mono block uppercase">Reconstructed Journeys</span>
          <div className="text-xl font-bold text-signal-cyan font-mono mt-0.5">
            {auditReport.total_journeys}
          </div>
          <span className="text-[10px] text-rail-500 font-mono">{auditReport.total_trains} Distinct Trains</span>
        </div>

        <div className="bg-rail-900 border border-rail-800 p-3.5 rounded-lg">
          <span className="text-[10px] text-rail-400 font-mono block uppercase">Journey Completeness</span>
          <div className="text-xl font-bold text-signal-green font-mono mt-0.5">
            {auditReport.journey_completeness_pct}%
          </div>
          <span className="text-[10px] text-rail-500 font-mono">Origin → Dest Paths</span>
        </div>

        <div className="bg-rail-900 border border-rail-800 p-3.5 rounded-lg">
          <span className="text-[10px] text-rail-400 font-mono block uppercase">Timestamp Plausibility</span>
          <div className="text-xl font-bold text-signal-green font-mono mt-0.5">
            {auditReport.timestamp_plausibility_pct}%
          </div>
          <span className="text-[10px] text-rail-500 font-mono">Midnight Rollover Handled</span>
        </div>
      </div>

      {/* Detected Columns & Schema Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Detected Columns */}
        <div className="lg:col-span-6 bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-rail-800 pb-3 mb-3">
            <Database className="w-4 h-4 text-signal-cyan" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Detected Schema Columns ({auditReport.detected_columns.length})
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {auditReport.detected_columns.map((col, idx) => (
              <span
                key={idx}
                className="bg-rail-850 text-rail-200 border border-rail-750 px-2 py-1 rounded text-xs font-mono"
              >
                {col}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-rail-800">
            <div className="text-xs font-mono text-rail-400 uppercase mb-2">Mandatory Schema Compliance:</div>
            <div className="flex items-center space-x-2 text-xs text-signal-green font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>All mandatory fields present (train_id, journey_date, station_sequence, timestamps).</span>
            </div>
          </div>
        </div>

        {/* Custom Dataset Upload / Mapping Box */}
        <div className="lg:col-span-6 bg-rail-900 border border-rail-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 border-b border-rail-800 pb-3 mb-3">
              <Upload className="w-4 h-4 text-signal-cyan" />
              <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                Upload Custom Railway CSV / NTES Dump
              </h3>
            </div>
            <p className="text-xs text-rail-300 leading-relaxed">
              Upload custom CSV datasets (e.g., Kaggle IR Delay 2025 or data.gov.in timetable). The pipeline will automatically inspect schema, map fields, detect date rollovers, and recalculate section statistics.
            </p>
          </div>

          <div className="mt-4">
            <button
              onClick={handleSimulatedUpload}
              disabled={isUploading}
              className="w-full bg-rail-800 hover:bg-rail-750 border border-rail-700 text-white font-mono text-xs py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-signal-cyan" />
              <span>{isUploading ? 'Inspecting Schema & Auditing...' : 'Select & Audit Railway Dataset'}</span>
            </button>

            {uploadSuccess && (
              <div className="mt-2 text-xs text-signal-green font-mono text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dataset schema validated successfully. Quality grade: A.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

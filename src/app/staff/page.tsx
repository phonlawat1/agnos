"use client";

import { useEffect, useState, useMemo } from "react";
import { useSocket } from "@/hooks/useSocket";
import PatientLiveCard from "@/components/staff/PatientLiveCard";
import type { Patient } from "@/types/patient";
import { usePatientStore } from "@/store/patientStore";

type ViewMode = "grid" | "list" | "map";
type SortOption = "newest" | "oldest" | "name" | "gender" | "typing";

interface PatientSubmission extends Patient {
  submissionId: string; // Unique ID for each submission
  submissionNumber: number; // Sequential number
  submittedAt: Date; // When this specific submission was made
}

export default function StaffPage() {
  const patients = usePatientStore((s) => s.patients);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [showTypingOnly, setShowTypingOnly] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Use store for adding/updating patients
    socket.on("patient-added", (data: Patient) => {
      usePatientStore.getState().addPatient({ ...data, isTyping: false });
    });

    socket.on("patient-typing", (data: { patientId: string }) => {
      usePatientStore
        .getState()
        .updatePatient(data.patientId, { isTyping: true });
    });

    socket.on("patient-stopped-typing", (data: { patientId: string }) => {
      usePatientStore
        .getState()
        .updatePatient(data.patientId, { isTyping: false });
    });

    return () => {
      socket.off("patient-added");
      socket.off("patient-typing");
      socket.off("patient-stopped-typing");
    };
  }, [socket]);

  // Filter and sort submissions
  const filteredSubmissions = useMemo(() => {
    // Map patients to a submission-like shape
    const mapped = patients.map((p, idx) => {
      const submittedAt = p.timestamp ? new Date(p.timestamp) : new Date();
      return {
        ...p,
        submissionId: `${p.id || idx}-${submittedAt.getTime()}`,
        submissionNumber: idx + 1,
        submittedAt,
      } as PatientSubmission;
    });

    let filtered = mapped;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query) ||
          p.phone.includes(query)
      );
    }

    // Sort
    const sorted = [...filtered];

    return sorted;
  }, [patients, searchQuery, filterGender, showTypingOnly, sortBy]);

  // Statistics - count unique patients who have submitted
  const stats = useMemo(() => {
    const uniquePatients = new Map<string, PatientSubmission>();
    filteredSubmissions.forEach((sub) => {
      const patientId = sub.id || sub.submissionId;
      if (!uniquePatients.has(patientId)) {
        uniquePatients.set(patientId, sub);
      }
    });

    const uniqueList = Array.from(uniquePatients.values());

    return {
      totalSubmissions: filteredSubmissions.length,
      uniquePatients: uniquePatients.size,
      typing: filteredSubmissions.filter((p) => p.isTyping).length,
      male: uniqueList.filter((p) => p.gender === "male").length,
      female: uniqueList.filter((p) => p.gender === "female").length,
      other: uniqueList.filter((p) => p.gender === "other").length,
    };
  }, [filteredSubmissions]);

  console.log(filteredSubmissions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Patient Registration History
          </h1>
          <p className="text-gray-600">
            View all patient submissions and registrations in real-time (newest
            first)
          </p>
        </div>

        {/* Display Content */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filteredSubmissions.length === 0
                ? "No submissions yet"
                : "No results found"}
            </h3>
            <p className="text-gray-600">
              {filteredSubmissions.length === 0
                ? "Waiting for patient form submissions... Check back soon!"
                : "Try adjusting your search or filter criteria"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((submission) => (
                <div key={submission.submissionId} className="relative">
                  <div className="absolute -top-3 -right-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center z-10 shadow-lg">
                    #{submission.submissionNumber}
                  </div>
                  <PatientLiveCard patient={submission} />
                </div>
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {filteredSubmissions.length}
                </span>{" "}
                of <span className="font-semibold">{patients.length}</span>{" "}
                submissions
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

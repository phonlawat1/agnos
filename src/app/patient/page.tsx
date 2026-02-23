"use client";

import PatientForm from "@/components/form/PatientForm";

export default function PatientPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Patient Registration
          </h1>
          <p className="text-gray-600">
            Please fill out the form below with your information. All required
            fields must be completed.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border-t-4 border-blue-500">
          <PatientForm />
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Your information will be securely transmitted to the staff dashboard
            for processing.
          </p>
        </div>
      </div>
    </div>
  );
}

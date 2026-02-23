import { formatDate, calculateAge } from "@/lib/utils";
import type { Patient } from "@/types/patient";

interface PatientLiveCardProps {
  patient: Patient;
}

export default function PatientLiveCard({ patient }: PatientLiveCardProps) {
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-500">
      {/* Header with Status */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {patient.firstName}{" "}
            {patient.middleName ? patient.middleName + " " : ""}
            {patient.lastName}
          </h3>
          <p className="text-sm text-gray-600">
            {age} years old • {patient.gender}
          </p>
        </div>
        <div className="text-right">
          {patient.isTyping && (
            <div className="inline-block">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                Typing...
              </span>
            </div>
          )}
          {!patient.isTyping && patient.timestamp && (
            <p className="text-xs text-gray-500">
              Submitted: {formatDate(patient.timestamp)}
            </p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-gray-600 font-medium">Email</p>
            <p className="text-gray-900 break-all">{patient.email}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Phone</p>
            <p className="text-gray-900">{patient.phone}</p>
          </div>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Date of Birth</p>
          <p className="text-gray-900">{formatDate(patient.dateOfBirth)}</p>
        </div>

        <div>
          <p className="text-gray-600 font-medium">Address</p>
          <p className="text-gray-900">{patient.address}</p>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div>
            <p className="text-gray-600 font-medium">Language</p>
            <p className="text-gray-900">{patient.preferredLanguage}</p>
          </div>
          <div>
            <p className="text-gray-600 font-medium">Nationality</p>
            <p className="text-gray-900">{patient.nationality}</p>
          </div>
        </div>

        {patient.religion && (
          <div>
            <p className="text-gray-600 font-medium">Religion</p>
            <p className="text-gray-900">{patient.religion}</p>
          </div>
        )}

        {/* Emergency Contact */}
        {(patient.emergencyContactName ||
          patient.emergencyContactRelationship) && (
          <div className="pt-2 border-t bg-blue-50 p-3 rounded">
            <p className="text-gray-600 font-medium text-sm">
              Emergency Contact
            </p>
            <p className="text-gray-900">
              {patient.emergencyContactName}
              {patient.emergencyContactRelationship &&
                ` (${patient.emergencyContactRelationship})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { usePatientForm } from "@/hooks/usePatientForm";
import FormField from "./FormField";
import ValidationMessage from "./ValidationMessage";
import Button from "@/components/ui/Button";
import type { PatientFormData } from "@/lib/validation";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Arabic",
  "Hindi",
  "Portuguese",
  "Russian",
];

const NATIONALITIES = [
  "American",
  "British",
  "Canadian",
  "Australian",
  "Indian",
  "Mexican",
  "Chinese",
  "Japanese",
  "German",
  "French",
  "Other",
];

const RELIGIONS = [
  "Christianity",
  "Islam",
  "Hinduism",
  "Buddhism",
  "Judaism",
  "Sikhism",
  "Atheism",
  "Agnosticism",
  "Other",
  "Prefer not to say",
];

export default function PatientForm() {
  const {
    submitPatient,
    isLoading,
    error,
    notifyTyping,
    notifyStoppedTyping,
  } = usePatientForm();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "other",
    address: "",
    preferredLanguage: "English",
    nationality: "American",
    religion: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Notify that user is typing
    notifyTyping();

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to notify stopped typing
    typingTimeoutRef.current = setTimeout(() => {
      notifyStoppedTyping();
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitPatient(formData);
      // Reset form
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "other",
        address: "",
        preferredLanguage: "English",
        nationality: "American",
        religion: "",
        emergencyContactName: "",
        emergencyContactRelationship: "",
      });
      setValidationErrors({});
      alert("Patient registered successfully!");
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <ValidationMessage type="error" message={error} />}

      {/* Personal Information Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="John"
          />
          <FormField
            label="Middle Name"
            type="text"
            name="middleName"
            value={formData.middleName || ""}
            onChange={handleChange}
            required={false}
            placeholder="(Optional)"
          />
        </div>

        <FormField
          label="Last Name"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          placeholder="Doe"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Contact Information
        </h2>

        <FormField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
        />

        <FormField
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="+1 (555) 000-0000"
        />

        <FormField
          label="Address"
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="123 Main Street"
        />
      </div>

      {/* Additional Information Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Additional Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Language <span className="text-red-500">*</span>
            </label>
            <select
              name="preferredLanguage"
              value={formData.preferredLanguage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {NATIONALITIES.map((nat) => (
                <option key={nat} value={nat}>
                  {nat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">
            Religion <span className="text-gray-500">(Optional)</span>
          </label>
          <select
            name="religion"
            value={formData.religion || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select or leave blank</option>
            {RELIGIONS.map((rel) => (
              <option key={rel} value={rel}>
                {rel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Emergency Contact Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Emergency Contact{" "}
          <span className="text-gray-500 text-base font-normal">
            (Optional)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Emergency Contact Name"
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName || ""}
            onChange={handleChange}
            required={false}
            placeholder="Jane Doe"
          />

          <FormField
            label="Relationship"
            type="text"
            name="emergencyContactRelationship"
            value={formData.emergencyContactRelationship || ""}
            onChange={handleChange}
            required={false}
            placeholder="Spouse"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} variant="primary">
          {isLoading ? "Submitting..." : "Register Patient"}
        </Button>
        <Button
          type="button"
          onClick={() => {
            setFormData({
              firstName: "",
              middleName: "",
              lastName: "",
              email: "",
              phone: "",
              dateOfBirth: "",
              gender: "other",
              address: "",
              preferredLanguage: "English",
              nationality: "American",
              religion: "",
              emergencyContactName: "",
              emergencyContactRelationship: "",
            });
            setValidationErrors({});
          }}
          variant="secondary"
        >
          Clear Form
        </Button>
      </div>
    </form>
  );
}

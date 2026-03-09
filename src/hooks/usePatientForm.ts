'use client';

import { useState } from 'react';
import { useSocket } from './useSocket';
import { patientSchema, type PatientFormData } from '@/lib/validation';
import { generateId } from '@/lib/utils';
import type { Patient } from '@/types/patient';
import { usePatientStore } from '@/store/patientStore';
import { initSocket } from "@/lib/socket";

export function usePatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();
  const [patientId] = useState(() => generateId());

  const submitPatient = async (data: PatientFormData) => {
  setIsLoading(true);
  setError(null);

  try {
    const validatedData = patientSchema.parse(data);

    const patient: Patient = {
      id: patientId,
      ...validatedData,
      timestamp: new Date(),
      isTyping: false,
    };

    // 🔥 FIX สำคัญ
    const activeSocket = socket || initSocket();

    console.log("📤 Emitting new-patient:", patient.id);

    activeSocket.emit("new-patient", patient);
    activeSocket.emit("patient-stopped-typing", { patientId });

    usePatientStore.getState().addPatient(patient);

    return patient;
  } catch (err) {
    const message = err instanceof Error ? err.message : "An error occurred";
    setError(message);
    throw err;
  } finally {
    setIsLoading(false);
  }
};

  const notifyTyping = () => {
    if (socket) {
      socket.emit('patient-typing', { patientId });
    }
  };

  const notifyStoppedTyping = () => {
    if (socket) {
      socket.emit('patient-stopped-typing', { patientId });
    }
  };

  return { submitPatient, isLoading, error, notifyTyping, notifyStoppedTyping, patientId };
}

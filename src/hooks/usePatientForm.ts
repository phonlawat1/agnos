'use client';

import { useState } from 'react';
import { useSocket } from './useSocket';
import { patientSchema, type PatientFormData } from '@/lib/validation';
import { generateId } from '@/lib/utils';
import type { Patient } from '@/types/patient';
import { usePatientStore } from '@/store/patientStore';

export function usePatientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();
  const [patientId] = useState(() => generateId());

  const submitPatient = async (data: PatientFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate data
      const validatedData = patientSchema.parse(data);

      const patient: Patient = {
        id: patientId,
        ...validatedData,
        timestamp: new Date(),
        isTyping: false,
      };

      // Emit via socket to staff
      if (socket) {
        socket.emit('patient-submit', patient);
        // Notify that typing has stopped
        socket.emit('patient-stopped-typing', { patientId });
      }

      // Add to local store (optimistic)
      try {
        usePatientStore.getState().addPatient(patient);
      } catch (e) {
        // ignore store errors
      }

      return patient;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
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

import { create } from "zustand";
import type { Patient } from "@/types/patient";

interface PatientStore {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  removePatient: (id: string) => void;
  clearPatients: () => void;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  getPatients: () => Patient[];
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],

  addPatient: (patient: Patient) =>
    set((state) => ({
      // Append new patient to the end of the history array
      patients: [...state.patients, patient],
    })),

  removePatient: (id: string) =>
    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
    })),

  clearPatients: () => set({ patients: [] }),

  updatePatient: (id: string, patch: Partial<Patient>) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...patch } : p
      ),
    })),

  getPatients: () => get().patients,
}));

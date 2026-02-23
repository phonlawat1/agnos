export interface Patient {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: string;
  preferredLanguage: string;
  nationality: string;
  religion?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  timestamp?: Date;
  isTyping?: boolean;
}

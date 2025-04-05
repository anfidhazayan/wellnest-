
export interface EmergencyAlert {
  id: string;
  timestamp: Date;
  type: "emergency" | "medical" | "fall" | "other";
  status: "active" | "resolved" | "canceled";
  contactsNotified: string[];
  description?: string;
  location?: string;
  resolvedAt?: Date;
}

export interface EmergencyAlertHistory {
  alerts: EmergencyAlert[];
  addAlert: (alert: Omit<EmergencyAlert, "id" | "timestamp">) => Promise<string>;
  updateAlertStatus: (id: string, status: EmergencyAlert["status"], resolvedAt?: Date) => Promise<boolean>;
  getActiveAlerts: () => Promise<EmergencyAlert[]>;
  getAllAlerts: () => Promise<EmergencyAlert[]>;
}

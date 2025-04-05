
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
  addAlert: (alert: Omit<EmergencyAlert, "id" | "timestamp">) => string;
  updateAlertStatus: (id: string, status: EmergencyAlert["status"], resolvedAt?: Date) => boolean;
  getActiveAlerts: () => EmergencyAlert[];
  getAllAlerts: () => EmergencyAlert[];
}


import React from "react";
import { useElderlyProfile } from "@/contexts/ElderlyProfileContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EmergencyAlertHistory = () => {
  const { emergencyAlerts } = useElderlyProfile();
  const allAlerts = emergencyAlerts.getAllAlerts();

  if (allAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-medical-600 mr-2" />
            Emergency Alert History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm italic">No emergency alerts have been triggered yet.</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "canceled":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "canceled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "";
    }
  };

  const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const handleResolveAlert = (alertId: string) => {
    emergencyAlerts.updateAlertStatus(alertId, "resolved");
  };

  const handleCancelAlert = (alertId: string) => {
    emergencyAlerts.updateAlertStatus(alertId, "canceled");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-medical-600 mr-2" />
          Emergency Alert History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {allAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-md p-4 ${
                alert.status === "active" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium flex items-center">
                  <AlertTriangle className={`h-4 w-4 mr-2 ${
                    alert.status === "active" ? "text-red-600" : "text-gray-600"
                  }`} />
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                </div>
                <Badge className={getStatusColor(alert.status)}>
                  <span className="flex items-center">
                    {getStatusIcon(alert.status)}
                    <span className="ml-1">
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </span>
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">
                Triggered: {formatDateTime(alert.timestamp)}
              </p>
              
              {alert.resolvedAt && (
                <p className="text-sm text-gray-600 mb-1">
                  Resolved: {formatDateTime(alert.resolvedAt)}
                </p>
              )}
              
              {alert.description && (
                <p className="text-sm mt-2 mb-2">{alert.description}</p>
              )}
              
              {alert.location && (
                <p className="text-sm text-gray-600 mb-1">Location: {alert.location}</p>
              )}
              
              <p className="text-sm text-gray-600 mb-3">
                Contacts notified: {alert.contactsNotified.join(", ")}
              </p>
              
              {alert.status === "active" && (
                <div className="flex justify-end space-x-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCancelAlert(alert.id)}
                  >
                    Cancel Alert
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleResolveAlert(alert.id)}
                  >
                    Mark Resolved
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyAlertHistory;

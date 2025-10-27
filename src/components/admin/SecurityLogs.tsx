import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Shield, AlertCircle } from "lucide-react";

export function SecurityLogs() {
  const securityLogs = [
    {
      id: 1,
      timestamp: "Oct 21, 2025 14:32:15",
      user: "admin@quittingjourney.com",
      action: "Login Attempt",
      result: "Success",
      details: "Admin panel login from IP: 192.168.1.1",
    },
    {
      id: 2,
      timestamp: "Oct 21, 2025 13:45:22",
      user: "john.smith@admin.com",
      action: "Account Update",
      result: "Success",
      details: "Updated user Sarah Mitchell's profile",
    },
    {
      id: 3,
      timestamp: "Oct 21, 2025 12:18:09",
      user: "unknown@malicious.com",
      action: "Login Attempt",
      result: "Failure",
      details: "Failed login - Invalid credentials (3 attempts)",
    },
    {
      id: 4,
      timestamp: "Oct 21, 2025 11:05:47",
      user: "sarah.j@admin.com",
      action: "Content Published",
      result: "Success",
      details: "Published blog: 'Understanding Nicotine Addiction'",
    },
    {
      id: 5,
      timestamp: "Oct 21, 2025 10:22:33",
      user: "admin@quittingjourney.com",
      action: "Admin Created",
      result: "Success",
      details: "Added new admin: Emily Davis (Advisor)",
    },
    {
      id: 6,
      timestamp: "Oct 21, 2025 09:15:18",
      user: "m.chen@admin.com",
      action: "User Deleted",
      result: "Success",
      details: "Deleted inactive user: test_user_042",
    },
    {
      id: 7,
      timestamp: "Oct 21, 2025 08:42:56",
      user: "unknown@suspicious.net",
      action: "Login Attempt",
      result: "Failure",
      details: "Failed login - Account locked after 5 attempts",
    },
    {
      id: 8,
      timestamp: "Oct 21, 2025 08:30:12",
      user: "sarah.j@admin.com",
      action: "Settings Changed",
      result: "Success",
      details: "Updated notification preferences",
    },
    {
      id: 9,
      timestamp: "Oct 20, 2025 23:15:44",
      user: "admin@quittingjourney.com",
      action: "Login Attempt",
      result: "Success",
      details: "Admin panel login from IP: 192.168.1.1",
    },
    {
      id: 10,
      timestamp: "Oct 20, 2025 22:08:31",
      user: "hacker@test.com",
      action: "Login Attempt",
      result: "Failure",
      details: "Failed login - Invalid credentials",
    },
    {
      id: 11,
      timestamp: "Oct 20, 2025 19:45:29",
      user: "john.smith@admin.com",
      action: "Campaign Created",
      result: "Success",
      details: "Created campaign: '30-Day Smoke-Free Challenge'",
    },
    {
      id: 12,
      timestamp: "Oct 20, 2025 18:32:17",
      user: "emily.d@admin.com",
      action: "User Ban",
      result: "Success",
      details: "Banned user for violating community guidelines",
    },
    {
      id: 13,
      timestamp: "Oct 20, 2025 17:20:05",
      user: "m.chen@admin.com",
      action: "Content Deleted",
      result: "Success",
      details: "Removed inappropriate community post",
    },
    {
      id: 14,
      timestamp: "Oct 20, 2025 16:15:42",
      user: "test@attacker.org",
      action: "Login Attempt",
      result: "Failure",
      details: "Failed login - Blocked IP address",
    },
    {
      id: 15,
      timestamp: "Oct 20, 2025 15:08:28",
      user: "sarah.j@admin.com",
      action: "API Key Updated",
      result: "Success",
      details: "Rotated AI Service API key",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl mb-2" style={{ color: "#1C3B5E" }}>
          Security Logs
        </h2>
        <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
          Monitor system access and administrative actions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 rounded-2xl border-0 shadow-md">
          <p className="text-xs mb-2" style={{ color: "#333333", opacity: 0.7 }}>
            Total Events (24h)
          </p>
          <p className="text-2xl" style={{ color: "#1C3B5E" }}>
            156
          </p>
        </Card>

        <Card className="p-4 rounded-2xl border-0 shadow-md">
          <p className="text-xs mb-2" style={{ color: "#333333", opacity: 0.7 }}>
            Successful Actions
          </p>
          <p className="text-2xl" style={{ color: "#8BC34A" }}>
            142
          </p>
        </Card>

        <Card className="p-4 rounded-2xl border-0 shadow-md">
          <p className="text-xs mb-2" style={{ color: "#333333", opacity: 0.7 }}>
            Failed Attempts
          </p>
          <p className="text-2xl" style={{ color: "#D9534F" }}>
            14
          </p>
        </Card>
      </div>

      {/* Security Logs Table */}
      <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-xl"
              style={{ backgroundColor: "#D9534F20" }}
            >
              <Shield className="w-5 h-5" style={{ color: "#D9534F" }} />
            </div>
            <div>
              <h3 className="text-lg" style={{ color: "#1C3B5E" }}>
                Activity Log
              </h3>
              <p className="text-xs mt-0.5" style={{ color: "#333333", opacity: 0.6 }}>
                Real-time security and admin activity monitoring
              </p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader className="sticky top-0 z-10" style={{ backgroundColor: "#f8f8f8" }}>
              <TableRow className="border-b border-gray-100">
                <TableHead className="text-left py-4" style={{ color: "#1C3B5E" }}>
                  Timestamp
                </TableHead>
                <TableHead className="text-left" style={{ color: "#1C3B5E" }}>
                  User/Account
                </TableHead>
                <TableHead className="text-left" style={{ color: "#1C3B5E" }}>
                  Action Taken
                </TableHead>
                <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                  Result
                </TableHead>
                <TableHead className="text-left" style={{ color: "#1C3B5E" }}>
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityLogs.map((log, index) => {
                const isFailure = log.result === "Failure";
                
                return (
                  <TableRow
                    key={log.id}
                    className={`border-b border-gray-50 ${isFailure ? "bg-red-50/50" : ""}`}
                    style={{
                      backgroundColor: isFailure
                        ? "#D9534F10"
                        : index % 2 === 0
                        ? "white"
                        : "#fafafa",
                    }}
                  >
                    <TableCell className="py-4">
                      <p className="text-xs" style={{ color: "#333333", opacity: 0.8 }}>
                        {log.timestamp}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm" style={{ color: "#1C3B5E" }}>
                        {log.user}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm" style={{ color: "#333333" }}>
                        {log.action}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        {isFailure ? (
                          <div className="flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" style={{ color: "#D9534F" }} />
                            <span
                              className="text-xs px-2 py-1 rounded-lg"
                              style={{
                                backgroundColor: "#D9534F20",
                                color: "#D9534F",
                              }}
                            >
                              {log.result}
                            </span>
                          </div>
                        ) : (
                          <span
                            className="text-xs px-2 py-1 rounded-lg"
                            style={{
                              backgroundColor: "#8BC34A20",
                              color: "#8BC34A",
                            }}
                          >
                            {log.result}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs" style={{ color: "#333333", opacity: 0.7 }}>
                        {log.details}
                      </p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}

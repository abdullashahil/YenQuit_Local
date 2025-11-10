
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Shield, AlertCircle, CheckCircle, Search, Download, Filter } from "lucide-react";
import { useState } from "react";

export function SecurityLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAction, setSelectedAction] = useState("all");

  const securityLogs = [
    {
      id: 1,
      timestamp: "Oct 21, 2025 14:32:15",
      user: "admin@quittingjourney.com",
      action: "Login Attempt",
      result: "Success",
      details: "Admin panel login from IP: 192.168.1.1",
      severity: "low"
    },
    {
      id: 2,
      timestamp: "Oct 21, 2025 13:45:22",
      user: "john.smith@admin.com",
      action: "Account Update",
      result: "Success",
      details: "Updated user Sarah Mitchell's profile",
      severity: "low"
    },
    {
      id: 3,
      timestamp: "Oct 21, 2025 12:18:09",
      user: "unknown@malicious.com",
      action: "Login Attempt",
      result: "Failure",
      details: "Failed login - Invalid credentials (3 attempts)",
      severity: "high"
    },
    {
      id: 4,
      timestamp: "Oct 21, 2025 11:05:47",
      user: "sarah.j@admin.com",
      action: "Content Published",
      result: "Success",
      details: "Published blog: 'Understanding Nicotine Addiction'",
      severity: "low"
    },
    {
      id: 5,
      timestamp: "Oct 21, 2025 10:22:33",
      user: "admin@quittingjourney.com",
      action: "Admin Created",
      result: "Success",
      details: "Added new admin: Emily Davis (Advisor)",
      severity: "medium"
    },
    {
      id: 6,
      timestamp: "Oct 21, 2025 09:15:18",
      user: "m.chen@admin.com",
      action: "User Deleted",
      result: "Success",
      details: "Deleted inactive user: test_user_042",
      severity: "medium"
    },
    {
      id: 7,
      timestamp: "Oct 21, 2025 08:42:56",
      user: "unknown@suspicious.net",
      action: "Login Attempt",
      result: "Failure",
      details: "Failed login - Account locked after 5 attempts",
      severity: "high"
    },
    {
      id: 8,
      timestamp: "Oct 21, 2025 08:30:12",
      user: "sarah.j@admin.com",
      action: "Settings Changed",
      result: "Success",
      details: "Updated notification preferences",
      severity: "low"
    },
  ];

  const filteredLogs = securityLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = selectedAction === "all" || log.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "#D9534F";
      case "medium": return "#FFA500";
      case "low": return "#8BC34A";
      default: return "#333333";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold" style={{ color: "#1C3B5E" }}>
          Security Logs
        </h2>
        <p className="text-lg" style={{ color: "#333333", opacity: 0.7 }}>
          Monitor system access and administrative actions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                Total Events (24h)
              </p>
              <p className="text-3xl font-bold" style={{ color: "#1C3B5E" }}>
                156
              </p>
            </div>
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#1C3B5E20" }}>
              <Shield className="w-6 h-6" style={{ color: "#1C3B5E" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                Successful Actions
              </p>
              <p className="text-3xl font-bold" style={{ color: "#8BC34A" }}>
                142
              </p>
            </div>
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#8BC34A20" }}>
              <CheckCircle className="w-6 h-6" style={{ color: "#8BC34A" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                Failed Attempts
              </p>
              <p className="text-3xl font-bold" style={{ color: "#D9534F" }}>
                14
              </p>
            </div>
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#D9534F20" }}>
              <AlertCircle className="w-6 h-6" style={{ color: "#D9534F" }} />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                Active Threats
              </p>
              <p className="text-3xl font-bold" style={{ color: "#FFA500" }}>
                3
              </p>
            </div>
            <div className="p-3 rounded-2xl" style={{ backgroundColor: "#FFA50020" }}>
              <AlertCircle className="w-6 h-6" style={{ color: "#FFA500" }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Security Logs Table */}
      <Card className="rounded-3xl border-0 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: "#D9534F20" }}>
                <Shield className="w-6 h-6" style={{ color: "#D9534F" }} />
              </div>
              <div>
                <h3 className="text-xl font-semibold" style={{ color: "#1C3B5E" }}>
                  Security Activity Log
                </h3>
                <p className="text-sm mt-1" style={{ color: "#333333", opacity: 0.7 }}>
                  Real-time security and admin activity monitoring
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 rounded-2xl border-gray-200 h-12 w-full lg:w-64"
                />
              </div>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="rounded-2xl border border-gray-200 h-12 px-4 focus:border-[#20B2AA] transition-colors"
                style={{ color: "#1C3B5E" }}
              >
                <option value="all">All Actions</option>
                <option value="Login Attempt">Login Attempts</option>
                <option value="Account Update">Account Updates</option>
                <option value="Content Published">Content Published</option>
              </select>
              <Button
                className="px-6 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all font-semibold"
                style={{ color: "#1C3B5E" }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

       {/* Scrollable Table Area */}
<div className="overflow-x-auto rounded-b-3xl">
  <ScrollArea className="h-[600px] w-full min-w-[1200px]">
    <div className="min-w-[1000px]">
      <Table>
        <TableHeader className="sticky top-0 z-10" style={{ backgroundColor: "#f8f8f8" }}>
          <TableRow className="border-b border-gray-100">
            <TableHead className="text-left py-6 font-semibold" style={{ color: "#1C3B5E" }}>
              Timestamp
            </TableHead>
            <TableHead className="text-left font-semibold" style={{ color: "#1C3B5E" }}>
              User/Account
            </TableHead>
            <TableHead className="text-left font-semibold" style={{ color: "#1C3B5E" }}>
              Action
            </TableHead>
            <TableHead className="text-center font-semibold" style={{ color: "#1C3B5E" }}>
              Severity
            </TableHead>
            <TableHead className="text-center font-semibold" style={{ color: "#1C3B5E" }}>
              Result
            </TableHead>
            <TableHead className="text-left font-semibold" style={{ color: "#1C3B5E" }}>
              Details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => {
            const isFailure = log.result === "Failure";
            return (
              <TableRow
                key={log.id}
                className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                  isFailure ? "bg-red-50/50" : ""
                }`}
              >
                <TableCell className="py-5">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#1C3B5E" }}>
                      {log.timestamp.split(" ")[0]}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#333333", opacity: 0.7 }}>
                      {log.timestamp.split(" ")[1]}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium" style={{ color: "#1C3B5E" }}>
                    {log.user}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium" style={{ color: "#333333" }}>
                    {log.action}
                  </p>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium"
                      style={{
                        backgroundColor: `${getSeverityColor(log.severity)}20`,
                        color: getSeverityColor(log.severity),
                      }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getSeverityColor(log.severity) }}
                      />
                      {log.severity.charAt(0).toUpperCase() + log.severity.slice(1)}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {isFailure ? (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" style={{ color: "#D9534F" }} />
                        <span
                          className="text-xs px-3 py-1 rounded-lg font-medium"
                          style={{
                            backgroundColor: "#D9534F20",
                            color: "#D9534F",
                          }}
                        >
                          {log.result}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" style={{ color: "#8BC34A" }} />
                        <span
                          className="text-xs px-3 py-1 rounded-lg font-medium"
                          style={{
                            backgroundColor: "#8BC34A20",
                            color: "#8BC34A",
                          }}
                        >
                          {log.result}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm" style={{ color: "#333333", opacity: 0.8 }}>
                    {log.details}
                  </p>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  </ScrollArea>
</div>

      </Card>
    </div>
  );
}
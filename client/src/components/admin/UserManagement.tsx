import { AdminSidebar } from "./AdminSidebar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UserDetailModal } from "./UserDetailModal";
import { Search, Eye, Edit, Trash2, Send, Download, UserPlus, Filter, MoreVertical, Mail, Phone, Calendar, Activity, ChevronDown } from "lucide-react";
import { useState } from "react";

interface UserManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export function UserManagement({ activeTab, setActiveTab, onExitAdmin, onLogout }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [addictionFilter, setAddictionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [progressFilter, setProgressFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Mock user data with additional fields
  const users = [
    {
      id: 1,
      name: "Sarah Mitchell",
      email: "sarah.mitchell@email.com",
      phone: "+1 (555) 123-4567",
      age: 34,
      fagerstrom: 7,
      addictionLevel: "High",
      status: "Active",
      joinDate: "Jan 15, 2024",
      lastLogin: "Oct 16, 2025",
      progress: 65,
      sessionsCompleted: 12,
      streak: 7,
    },
    {
      id: 2,
      name: "James Thompson",
      email: "james.t@email.com",
      phone: "+1 (555) 234-5678",
      age: 28,
      fagerstrom: 4,
      addictionLevel: "Moderate",
      status: "Active",
      joinDate: "Feb 22, 2024",
      lastLogin: "Oct 15, 2025",
      progress: 42,
      sessionsCompleted: 8,
      streak: 3,
    },
    {
      id: 3,
      name: "Maria Garcia",
      email: "m.garcia@email.com",
      phone: "+1 (555) 345-6789",
      age: 41,
      fagerstrom: 2,
      addictionLevel: "Low",
      status: "Quit",
      joinDate: "Mar 10, 2024",
      lastLogin: "Oct 14, 2025",
      progress: 98,
      sessionsCompleted: 20,
      streak: 45,
    },
    {
      id: 4,
      name: "Robert Chen",
      email: "robert.chen@email.com",
      phone: "+1 (555) 456-7890",
      age: 52,
      fagerstrom: 8,
      addictionLevel: "High",
      status: "Active",
      joinDate: "Apr 05, 2024",
      lastLogin: "Oct 16, 2025",
      progress: 28,
      sessionsCompleted: 5,
      streak: 2,
    },
    {
      id: 5,
      name: "Emily Brown",
      email: "emily.brown@email.com",
      phone: "+1 (555) 567-8901",
      age: 31,
      fagerstrom: 5,
      addictionLevel: "Moderate",
      status: "Relapsed",
      joinDate: "May 18, 2024",
      lastLogin: "Oct 12, 2025",
      progress: 75,
      sessionsCompleted: 15,
      streak: 0,
    },
    {
      id: 6,
      name: "Michael Davis",
      email: "m.davis@email.com",
      phone: "+1 (555) 678-9012",
      age: 45,
      fagerstrom: 3,
      addictionLevel: "Low",
      status: "Active",
      joinDate: "Jun 30, 2024",
      lastLogin: "Oct 16, 2025",
      progress: 88,
      sessionsCompleted: 18,
      streak: 21,
    },
    {
      id: 7,
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      phone: "+1 (555) 789-0123",
      age: 38,
      fagerstrom: 6,
      addictionLevel: "Moderate",
      status: "Active",
      joinDate: "Jul 12, 2024",
      lastLogin: "Oct 15, 2025",
      progress: 55,
      sessionsCompleted: 10,
      streak: 5,
    },
    {
      id: 8,
      name: "David Wilson",
      email: "d.wilson@email.com",
      phone: "+1 (555) 890-1234",
      age: 29,
      fagerstrom: 9,
      addictionLevel: "High",
      status: "Active",
      joinDate: "Aug 25, 2024",
      lastLogin: "Oct 16, 2025",
      progress: 15,
      sessionsCompleted: 3,
      streak: 1,
    },
  ];

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAddiction =
      addictionFilter === "all" || user.addictionLevel === addictionFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesProgress =
      progressFilter === "all" || 
      (progressFilter === "high" && user.progress >= 80) ||
      (progressFilter === "medium" && user.progress >= 50 && user.progress < 80) ||
      (progressFilter === "low" && user.progress < 50);
    
    return matchesSearch && matchesAddiction && matchesStatus && matchesProgress;
  });

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const getAddictionColor = (level: string) => {
    if (level === "High") return "#D9534F";
    if (level === "Moderate") return "#FFA726";
    return "#8BC34A";
  };

  const getStatusColor = (status: string) => {
    if (status === "Quit") return "#8BC34A";
    if (status === "Relapsed") return "#D9534F";
    return "#20B2AA";
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const selectAllRows = () => {
    setSelectedRows(
      selectedRows.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "#8BC34A";
    if (progress >= 50) return "#FFA726";
    return "#D9534F";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 to-white">
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={onExitAdmin}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="lg:ml-10">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {/* Page Header with Stats */}
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#1C3B5E]">
                    User Management
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    Manage user accounts, track progress, and provide personalized support
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <Button
                    className="h-12 rounded-2xl flex items-center gap-2 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ 
                      background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)",
                      color: "white" 
                    }}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Add User</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-12 rounded-2xl flex items-center gap-2 px-6 border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Users", value: "1,247", change: "+12%", icon: Activity, color: "#20B2AA" },
                  { label: "Active Users", value: "892", change: "+8%", icon: Eye, color: "#10B981" },
                  { label: "Success Rate", value: "68%", change: "+5%", icon: Calendar, color: "#F59E0B" },
                  { label: "Avg. Progress", value: "72%", change: "+3%", icon: Mail, color: "#8B5CF6" }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-[#1C3B5E]">{stat.value}</p>
                        </div>
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${stat.color}20` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: stat.color }} />
                        </div>
                      </div>
                      <p className="text-xs text-green-600 mt-2 font-medium">{stat.change} from last month</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                {/* Search Input */}
                <div className="lg:col-span-4">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Search Users
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "#20B2AA" }}
                    />
                    <Input
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Addiction Level Filter */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Addiction Level
                  </label>
                  <Select value={addictionFilter} onValueChange={setAddictionFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 bg-white">
                      <SelectValue placeholder="All Levels" />
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">All Levels</SelectItem>
                      <SelectItem value="Low" className="rounded-lg hover:bg-green-50 focus:bg-green-50">Low</SelectItem>
                      <SelectItem value="Moderate" className="rounded-lg hover:bg-orange-50 focus:bg-orange-50">Moderate</SelectItem>
                      <SelectItem value="High" className="rounded-lg hover:bg-red-50 focus:bg-red-50">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 bg-white">
                      <SelectValue placeholder="All Statuses" />
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">All Statuses</SelectItem>
                      <SelectItem value="Active" className="rounded-lg hover:bg-cyan-50 focus:bg-cyan-50">Active</SelectItem>
                      <SelectItem value="Quit" className="rounded-lg hover:bg-green-50 focus:bg-green-50">Quit</SelectItem>
                      <SelectItem value="Relapsed" className="rounded-lg hover:bg-red-50 focus:bg-red-50">Relapsed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress Filter */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Progress
                  </label>
                  <Select value={progressFilter} onValueChange={setProgressFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 bg-white">
                      <SelectValue placeholder="All Progress" />
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">All Progress</SelectItem>
                      <SelectItem value="high" className="rounded-lg hover:bg-green-50 focus:bg-green-50">High (80%+)</SelectItem>
                      <SelectItem value="medium" className="rounded-lg hover:bg-orange-50 focus:bg-orange-50">Medium (50-79%)</SelectItem>
                      <SelectItem value="low" className="rounded-lg hover:bg-red-50 focus:bg-red-50">Low (0-49%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2 flex gap-2">
                  <Button
                    variant="outline"
                    className="h-12 flex-1 rounded-2xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
              </div>

              {/* Results Count and Bulk Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-[#1C3B5E]">{filteredUsers.length}</span> of{" "}
                  <span className="font-semibold text-[#1C3B5E]">{users.length}</span> users
                </div>
                
                {selectedRows.length > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {selectedRows.length} selected
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 text-red-600 hover:text-red-700 hover:border-red-200 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Main User Table */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <TableHead className="w-12 py-4 pl-6">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={selectAllRows}
                          className="rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA] w-4 h-4"
                        />
                      </TableHead>
                      <TableHead className="py-4 font-semibold text-[#1C3B5E] min-w-[180px]">
                        User
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] min-w-[200px]">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] min-w-[140px]">
                        Progress
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[120px]">
                        Fagerström
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[120px]">
                        Level
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[120px]">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[140px]">
                        Last Activity
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[160px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={`border-b border-gray-50 transition-all duration-200 group ${
                          selectedRows.includes(user.id) 
                            ? 'bg-blue-50/50' 
                            : 'hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/30'
                        }`}
                      >
                        <TableCell className="py-4 pl-6">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(user.id)}
                            onChange={() => toggleRowSelection(user.id)}
                            className="rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA] w-4 h-4"
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#20B2AA] to-[#1C9B94] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold text-[#1C3B5E] group-hover:text-[#1C9B94] transition-colors duration-200">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">Age: {user.age}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {user.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="w-16 bg-gray-200 rounded-full h-2 flex-1">
                                <div
                                  className="h-2 rounded-full transition-all duration-300 shadow-sm"
                                  style={{
                                    width: `${user.progress}%`,
                                    backgroundColor: getProgressColor(user.progress)
                                  }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-[#1C3B5E] min-w-[40px]">
                                {user.progress}%
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">
                              {user.sessionsCompleted} sessions • {user.streak} days
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-transparent shadow-sm"
                            style={{
                              backgroundColor: `${getAddictionColor(user.addictionLevel)}15`,
                              color: getAddictionColor(user.addictionLevel),
                              borderColor: `${getAddictionColor(user.addictionLevel)}30`
                            }}
                          >
                            {user.fagerstrom}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-transparent shadow-sm"
                            style={{
                              backgroundColor: `${getAddictionColor(user.addictionLevel)}15`,
                              color: getAddictionColor(user.addictionLevel),
                              borderColor: `${getAddictionColor(user.addictionLevel)}30`
                            }}
                          >
                            {user.addictionLevel}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-transparent shadow-sm"
                            style={{
                              backgroundColor: `${getStatusColor(user.status)}15`,
                              color: getStatusColor(user.status),
                              borderColor: `${getStatusColor(user.status)}30`
                            }}
                          >
                            {user.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#1C3B5E]">{user.lastLogin}</p>
                            <p className="text-xs text-gray-500">Joined {user.joinDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewProfile(user)}
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#20B2AA10" }}
                              title="View Detailed Profile"
                            >
                              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#20B2AA" }} />
                            </button>

                            <button
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 hover:bg-gray-100 group"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4 group-hover:scale-110 transition-transform text-gray-600" />
                            </button>

                            <button
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#20B2AA10" }}
                              title="Send Message"
                            >
                              <Send className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#20B2AA" }} />
                            </button>

                            <button
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 hover:bg-gray-100 group"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4 group-hover:scale-110 transition-transform text-gray-600" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* No Results Message */}
              {filteredUsers.length === 0 && (
                <div className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-600 mb-2">
                    No users found
                  </p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Try adjusting your search criteria or filters to find what you're looking for.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {filteredUsers.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-[#1C3B5E]">1</span> of{" "}
                    <span className="font-semibold text-[#1C3B5E]">5</span> •{" "}
                    <span className="font-semibold text-[#1C3B5E]">{filteredUsers.length}</span> users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                    >
                      Previous
                    </Button>
                    <Button 
                      size="sm" 
                      className="rounded-xl bg-[#20B2AA] text-white hover:bg-[#1C9B94] transition-all duration-200 shadow-md"
                    >
                      1
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                    >
                      2
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                    >
                      3
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      <UserDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        user={selectedUser}
      />
    </div>
  );
}
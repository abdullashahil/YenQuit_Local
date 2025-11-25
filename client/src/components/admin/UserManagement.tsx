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
import { Search, Eye, Edit, Trash2, Send, Download, UserPlus, Filter, MoreVertical, Mail, Phone, Calendar, Activity, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import userService from "../../services/userService";

interface UserManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export function UserManagement({ activeTab, setActiveTab, onExitAdmin, onLogout }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch users from API
  const fetchUsers = async (page = 1, search = '', role = '', status = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await userService.getUsers({
        page,
        limit: 10,
        search,
        role,
        status
      });
      
      if (result.success) {
        setUsers(result.data);
        setPagination(result.pagination);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics from API
  const fetchStats = async () => {
    try {
      const result = await userService.getUserStats();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchUsers(1, searchQuery, roleFilter, statusFilter);
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchUsers(newPage, searchQuery, roleFilter, statusFilter);
  };

  // Handle user operations
  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await userService.deleteUser(userId);
      // Refresh the user list
      fetchUsers(1, searchQuery, roleFilter, statusFilter);
      fetchStats();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const handleView = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Transform API data to match expected format
  const transformedUsers = users.map((user) => ({
    ...user,
    name: user.name || 'Unknown',
    phone: user.phone || '-',
    age: user.age || '-',
    fagerstrom: user.fagerstrom_score || '-',
    addictionLevel: user.addiction_level || 'Unknown',
    status: user.status || 'Unknown',
    joinDate: formatDate(user.join_date),
    lastLogin: formatDate(user.last_login),
    progress: 0, // Backend doesn't track progress yet
    sessionsCompleted: 0, // Backend doesn't track sessions yet
    streak: 0, // Backend doesn't track streak yet
  }));

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
      selectedRows.length === transformedUsers.length
        ? []
        : transformedUsers.map(user => user.id)
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
                  ...(stats ? [
                    { label: "Total Users", value: stats.total.toString(), change: "+12%", icon: Activity, color: "#20B2AA" },
                    { label: "Active Users", value: stats.byStatus?.find((s: any) => s.status === 'active')?.count.toString() || "0", change: "+8%", icon: Eye, color: "#10B981" },
                    { label: "Admin Users", value: stats.byRole?.find((r: any) => r.role === 'admin')?.count.toString() || "0", change: "+5%", icon: Calendar, color: "#F59E0B" },
                    { label: "Recent Join", value: stats.recentRegistrations.toString(), change: "+3%", icon: Mail, color: "#8B5CF6" }
                  ] : [
                    { label: "Total Users", value: "-", change: "-", icon: Activity, color: "#20B2AA" },
                    { label: "Active Users", value: "-", change: "-", icon: Eye, color: "#10B981" },
                    { label: "Admin Users", value: "-", change: "-", icon: Calendar, color: "#F59E0B" },
                    { label: "Recent Join", value: "-", change: "-", icon: Mail, color: "#8B5CF6" }
                  ])
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
                          {typeof Icon === 'function' ? <Icon className="w-6 h-6" style={{ color: stat.color }} /> : <div className="w-6 h-6" style={{ color: stat.color }} />}
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

                {/* Role Filter */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Role
                  </label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 bg-white">
                      <SelectValue placeholder="All Roles" />
                      <ChevronDown className="w-4 h-4 opacity-50" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">All Roles</SelectItem>
                      <SelectItem value="admin" className="rounded-lg hover:bg-purple-50 focus:bg-purple-50">Admin</SelectItem>
                      <SelectItem value="user" className="rounded-lg hover:bg-cyan-50 focus:bg-cyan-50">User</SelectItem>
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
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading users...
                    </span>
                  ) : error ? (
                    <span className="text-red-600">Error: {error}</span>
                  ) : (
                    <>
                      Showing <span className="font-semibold text-[#1C3B5E]">{transformedUsers.length}</span> of{" "}
                      <span className="font-semibold text-[#1C3B5E]">{pagination.total}</span> users
                    </>
                  )}
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
                          checked={selectedRows.length === transformedUsers.length && transformedUsers.length > 0}
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 animate-spin text-[#20B2AA]" />
                            <p className="text-gray-600">Loading users...</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-red-600 font-semibold">Error: {error}</p>
                            <Button 
                              onClick={() => fetchUsers(1, searchQuery, roleFilter, statusFilter)}
                              variant="outline"
                              className="rounded-xl"
                            >
                              Retry
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transformedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-4">
                            <p className="text-gray-600 font-semibold">No users found</p>
                            <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transformedUsers.map((user, index) => (
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
                              onClick={() => handleView(user)}
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#20B2AA15" }}
                              title="View User Details"
                            >
                              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#20B2AA" }} />
                            </button>
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#F59E0B15" }}
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#F59E0B" }} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#D9534F10" }}
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#D9534F" }} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!isLoading && !error && transformedUsers.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-[#1C3B5E]">{pagination.page}</span> of{" "}
                    <span className="font-semibold text-[#1C3B5E]">{pagination.totalPages}</span> •{" "}
                    <span className="font-semibold text-[#1C3B5E]">{pagination.total}</span> users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Button 
                          key={pageNum}
                          size="sm" 
                          variant={pageNum === pagination.page ? "default" : "outline"}
                          className={`rounded-xl transition-all duration-200 ${
                            pageNum === pagination.page 
                              ? "bg-[#20B2AA] text-white shadow-md" 
                              : "border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA]"
                          }`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-xl border-gray-200 hover:border-[#20B2AA] hover:text-[#20B2AA] transition-all duration-200"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              {/* User Detail Modal */}
              <UserDetailModal 
                open={isDetailModalOpen}
                onOpenChange={setIsDetailModalOpen}
                user={selectedUser}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
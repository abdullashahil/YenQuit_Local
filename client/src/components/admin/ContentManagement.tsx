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
import { AddContentModal } from "./AddContentModal";
import { PreviewContentModal } from "./PreviewContentModal";
import { CampaignScheduler } from "./CampaignScheduler";
import { InsightsNotifications } from "../features/community/InsightsNotifications";
import { SystemConfiguration } from "./SystemConfiguration";
import { FiveAManagement } from "./FiveAManagement";
import { AssistHistory } from "./AssistHistory";
import { Search, Plus, Edit, Trash2, Eye, Filter, BarChart3, Users, Calendar, FileText, MessageSquare, Bell, Loader2, Settings, Heart, Clock, History, MessageCircle, Lightbulb, ClipboardCheck, Users as UsersIcon, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

interface ContentManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function ContentManagement({ activeTab, setActiveTab, onExitAdmin, onLogout }: ContentManagementProps) {
  const [activeContentTab, setActiveContentTab] = useState("content");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editContent, setEditContent] = useState<any>(null);
  const [previewContent, setPreviewContent] = useState<any>(null);
  const [contentList, setContentList] = useState<any[]>([]);
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

  const contentTabs = [
    { id: "content", label: "Content", icon: FileText },
    { id: "5a-management", label: "5A Management", icon: MessageCircle },
    { id: "notification-templates", label: "Notification Templates", icon: Bell },
    { id: "assist-history", label: "Assist History", icon: History },
    { id: "configuration", label: "System Configuration", icon: Settings },
  ];

  // Fetch content from API
  const fetchContent = async (page = 1, search = '', category = '', status = '') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (search) params.append('search', search);
      if (category && category !== 'all') params.append('category', category);
      if (status && status !== 'all') params.append('status', status);
      
      const response = await axios.get(`${API_BASE_URL}/content?${params.toString()}`);
      
      if (response.data.success) {
        setContentList(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch content');
      console.error('Error fetching content:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch statistics from API
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/content/stats`);
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchContent(1, searchQuery, categoryFilter, statusFilter);
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchContent(newPage, searchQuery, categoryFilter, statusFilter);
  };

  // Handle content operations
  const handleContentSaved = (savedContent: any) => {
    // Refresh the content list
    fetchContent(1, searchQuery, categoryFilter, statusFilter);
    fetchStats();
  };

  const handleDelete = async (contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/content/${contentId}`);
      // Refresh the content list
      fetchContent(1, searchQuery, categoryFilter, statusFilter);
      fetchStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete content');
      console.error('Error deleting content:', err);
    }
  };

  const handleEdit = (content: any) => {
    setEditContent(content);
    setIsAddModalOpen(true);
  };

  const handlePreview = (content: any) => {
    setPreviewContent(content);
    setIsPreviewModalOpen(true);
  };

  const handleAddNew = () => {
    setEditContent(null);
    setIsAddModalOpen(true);
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
  const transformedContent = contentList.map((content) => ({
    ...content,
    publishDate: formatDate(content.created_at),
    endDate: formatDate(content.end_date),
    views: 0, // Backend doesn't track views yet
    engagement: 0 // Backend doesn't track engagement yet
  }));

  const getStatusColor = (status: string) => {
    if (status === "Live") return "#8BC34A";
    if (status === "Draft") return "#FFA726";
    return "#20B2AA";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Blog": "#20B2AA",
      "Quote": "#FFA726",
      "Campaign": "#8B5CF6",
      "Video": "#EF4444",
      "Podcast": "#8BC34A",
      "Image": "#3B82F6"
    };
    return colors[category] || "#20B2AA";
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

      {/* Main Content Area - Properly Aligned */}
      <div className="lg:ml-10">
        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-full mx-auto">
            {/* Page Header with Stats */}
            <div className="mb-6 md:mb-8">
              {/* Tab Navigation */}
              <div className="w-full bg-white border-b border-gray-200 mb-6">
                <div className="flex items-center gap-0 overflow-x-auto">
                  {contentTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeContentTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveContentTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                          isActive
                            ? "border-[#20B2AA] text-[#20B2AA]"
                            : "border-transparent text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#1C3B5E]">
                    {activeContentTab === "content" && "Content Management"}
                    {activeContentTab === "5a-management" && "5A Methodology Management"}
                    {activeContentTab === "notification-templates" && "Notification Templates Management"}
                    {activeContentTab === "assist-history" && "Assist Plan History"}
                    {activeContentTab === "configuration" && "System Configuration"}
                  </h1>
                  <p className="text-sm md:text-base text-gray-600">
                    {activeContentTab === "content" && "Manage all public-facing content, campaigns, and user communications"}
                    {activeContentTab === "5a-management" && "Manage questions, content, and strategies for all 5A methodology steps"}
                    {activeContentTab === "notification-templates" && "Manage notification templates available to users in the ASSIST step"}
                    {activeContentTab === "assist-history" && "View completed assist plans and user progress"}
                    {activeContentTab === "configuration" && "Configure system settings, API keys, and global preferences"}
                  </p>
                </div>
                {activeContentTab === "content" && (
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <Button
                      className="h-12 rounded-2xl flex items-center gap-2 px-6 shadow-lg hover:shadow-xl transition-all duration-200"
                      style={{ 
                        background: "linear-gradient(135deg, #20B2AA 0%, #1C9B94 100%)",
                        color: "white" 
                      }}
                      onClick={handleAddNew}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create Content</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Conditional Content Rendering */}
            {activeContentTab === "content" ? (
              <>
                {/* Search & Filters Bar */}
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 p-4 md:p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                {/* Search Input */}
                <div className="lg:col-span-4">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Search Content
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "#20B2AA" }}
                    />
                    <Input
                      placeholder="Search by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Category
                  </label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 bg-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">All Categories</SelectItem>
                      <SelectItem value="Blog" className="rounded-lg hover:bg-cyan-50 focus:bg-cyan-50">Blog</SelectItem>
                      <SelectItem value="Quote" className="rounded-lg hover:bg-orange-50 focus:bg-orange-50">Quote</SelectItem>
                      {/* <SelectItem value="Campaign" className="rounded-lg hover:bg-purple-50 focus:bg-purple-50">Campaign</SelectItem> */}
                      <SelectItem value="Video" className="rounded-lg hover:bg-red-50 focus:bg-red-50">Video</SelectItem>
                      <SelectItem value="Podcast" className="rounded-lg hover:bg-green-50 focus:bg-green-50">Podcast</SelectItem>
                      <SelectItem value="Image" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                {/* <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-[#1C3B5E] mb-2">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-12 rounded-2xl border-gray-200 focus:border-[#20B2AA] focus:ring-[#20B2AA]/20 bg-white">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 rounded-2xl shadow-xl">
                      <SelectItem value="all" className="rounded-lg hover:bg-blue-50 focus:bg-blue-50">All Statuses</SelectItem>
                      <SelectItem value="Live" className="rounded-lg hover:bg-green-50 focus:bg-green-50">Live</SelectItem>
                      <SelectItem value="Draft" className="rounded-lg hover:bg-orange-50 focus:bg-orange-50">Draft</SelectItem>
                      <SelectItem value="Pending" className="rounded-lg hover:bg-cyan-50 focus:bg-cyan-50">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

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

              {/* Results Count */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-3">
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </span>
                  ) : error ? (
                    <span className="text-red-600">{error}</span>
                  ) : (
                    <>Showing <span className="font-semibold text-[#1C3B5E]">{contentList.length}</span> of{" "}
                    <span className="font-semibold text-[#1C3B5E]">{pagination.total}</span> content items</>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Table - Full Width */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                      <TableHead className="py-4 font-semibold text-[#1C3B5E] min-w-[280px]">
                        Content
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[100px]">
                        Category
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[120px]">
                        Created
                      </TableHead>
                      <TableHead className="font-semibold text-[#1C3B5E] text-center min-w-[140px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: "#20B2AA" }} />
                            <p className="text-lg font-semibold text-gray-600 mb-2">Loading content...</p>
                            <p className="text-sm text-gray-500">Please wait while we fetch your data</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                              <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-lg font-semibold text-red-600 mb-2">Error loading content</p>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">{error}</p>
                            <Button 
                              onClick={() => fetchContent(1, searchQuery, categoryFilter, statusFilter)}
                              className="mt-4 rounded-xl bg-[#20B2AA] hover:bg-[#1C9B94] text-white"
                            >
                              Try Again
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transformedContent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-16 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-lg font-semibold text-gray-600 mb-2">
                              No content found
                            </p>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                              Try adjusting your search criteria or filters to find what you're looking for.
                            </p>
                            <Button 
                              onClick={handleAddNew}
                              className="mt-4 rounded-xl bg-[#20B2AA] hover:bg-[#1C9B94] text-white"
                            >
                              Create Your First Content
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transformedContent.map((content, index) => (
                      <TableRow
                        key={content.id}
                        className={`border-b border-gray-50 transition-all duration-200 group ${
                          content.status === 'Draft' 
                            ? 'bg-orange-50/30' 
                            : content.status === 'Pending'
                            ? 'bg-blue-50/30'
                            : 'hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-cyan-50/30'
                        }`}
                      >
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <p className="font-semibold text-[#1C3B5E] group-hover:text-[#1C9B94] transition-colors duration-200 line-clamp-2">
                              {content.title}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {content.description}
                            </p>
                            {content.endDate !== "-" && (
                              <p className="text-xs text-gray-500">
                                Ends: {content.endDate}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-transparent shadow-sm mx-auto"
                            style={{
                              backgroundColor: `${getCategoryColor(content.category)}15`,
                              color: getCategoryColor(content.category),
                              borderColor: `${getCategoryColor(content.category)}30`
                            }}
                          >
                            {content.category}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-[#1C3B5E]">{content.publishDate}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handlePreview(content)}
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#20B2AA10" }}
                              title="Preview Content"
                            >
                              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#20B2AA" }} />
                            </button>

                            <button
                              onClick={() => handleDelete(content.id)}
                              className="p-2 rounded-xl transition-all duration-200 hover:shadow-md hover:scale-105 group"
                              style={{ backgroundColor: "#D9534F10" }}
                              title="Delete Content"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" style={{ color: "#D9534F" }} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {!isLoading && !error && transformedContent.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/50">
                  <div className="text-sm text-gray-600">
                    Page <span className="font-semibold text-[#1C3B5E]">{pagination.page}</span> of{" "}
                    <span className="font-semibold text-[#1C3B5E]">{pagination.totalPages}</span> •{" "}
                    <span className="font-semibold text-[#1C3B5E]">{pagination.total}</span> items
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
                    
                    {/* Page Numbers */}
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
            </div>

            {/* Campaign Scheduler */}
            {/* <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 overflow-hidden mb-6">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-[#20B2AA20]">
                    <Calendar className="w-5 h-5 text-[#20B2AA]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1C3B5E]">Campaign Scheduler</h3>
                </div>
                <p className="text-sm text-gray-600">Plan and schedule content campaigns</p>
              </div>
              <div className="p-6">
                <CampaignScheduler />
              </div>
            </div> */}

            </>
            ) : activeContentTab === "5a-management" ? (
              <FiveAManagement activeTab={activeContentTab} setActiveTab={setActiveContentTab} />
            ) : activeContentTab === "assist-history" ? (
              <AssistHistory activeTab={activeContentTab} setActiveTab={setActiveContentTab} />
            ) : (
              <SystemConfiguration />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddContentModal
        open={isAddModalOpen}
        onOpenChange={(open) => {
          setIsAddModalOpen(open);
          if (!open) setEditContent(null);
        }}
        editContent={editContent}
        onContentSaved={handleContentSaved}
      />
      <PreviewContentModal
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        content={previewContent}
      />
    </div>
  );
}
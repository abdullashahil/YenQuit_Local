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
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";

interface ContentManagementProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
}

export function ContentManagement({ activeTab, setActiveTab, onExitAdmin, onLogout }: ContentManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editContent, setEditContent] = useState<any>(null);
  const [previewContent, setPreviewContent] = useState<any>(null);

  // Mock content data
  const contentList = [
    {
      id: 1,
      title: "Understanding Nicotine Addiction",
      category: "Blog",
      publishDate: "Oct 10, 2025",
      status: "Live",
      endDate: "-",
      description: "A comprehensive guide to understanding nicotine dependence",
    },
    {
      id: 2,
      title: "You Are Stronger Than You Think",
      category: "Quote",
      publishDate: "Oct 15, 2025",
      status: "Live",
      endDate: "-",
      description: "Motivational quote by Dr. Sarah Johnson",
    },
    {
      id: 3,
      title: "30-Day Smoke-Free Challenge",
      category: "Campaign",
      publishDate: "Nov 1, 2025",
      status: "Pending",
      endDate: "Nov 30, 2025",
      description: "Join our community-wide challenge",
    },
    {
      id: 4,
      title: "Breathing Exercises for Cravings",
      category: "Video",
      publishDate: "Oct 12, 2025",
      status: "Live",
      endDate: "-",
      description: "5-minute guided breathing session",
    },
    {
      id: 5,
      title: "Overcoming Social Triggers",
      category: "Podcast",
      publishDate: "Oct 8, 2025",
      status: "Live",
      endDate: "-",
      description: "Expert discussion on managing social situations",
    },
    {
      id: 6,
      title: "Benefits Timeline Infographic",
      category: "Image",
      publishDate: "Oct 5, 2025",
      status: "Live",
      endDate: "-",
      description: "Visual guide to health improvements over time",
    },
    {
      id: 7,
      title: "Stress Management Techniques",
      category: "Blog",
      publishDate: "Oct 20, 2025",
      status: "Draft",
      endDate: "-",
      description: "Alternative strategies for coping with stress",
    },
    {
      id: 8,
      title: "Holiday Support Campaign",
      category: "Campaign",
      publishDate: "Dec 15, 2025",
      status: "Pending",
      endDate: "Jan 5, 2026",
      description: "Extra support during the holiday season",
    },
  ];

  // Filter logic
  const filteredContent = contentList.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || content.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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

  const getStatusColor = (status: string) => {
    if (status === "Live") return "#8BC34A";
    if (status === "Draft") return "#FFA726";
    return "#20B2AA";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Admin Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExitAdmin={onExitAdmin}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-[1800px] mx-auto">
          {/* Page Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl mb-2" style={{ color: "#1C3B5E" }}>
              Content Management
            </h1>
            <p className="text-sm md:text-base" style={{ color: "#333333" }}>
              Manage all public-facing content, campaigns, and user communications
            </p>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left Column - Content Table */}
            <div className="lg:col-span-8 space-y-4 md:space-y-6">
              {/* Management Toolbar */}
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border-0 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4">
                  {/* Add New Content Button */}
                  <div className="col-span-3">
                    <Button
                      onClick={handleAddNew}
                      className="w-full h-12 rounded-2xl text-white transition-all hover:opacity-90 shadow-md"
                      style={{ backgroundColor: "#20B2AA" }}
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add New Content
                    </Button>
                  </div>

                  {/* Search Input */}
                  <div className="col-span-5 relative">
                    <Search
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                      style={{ color: "#20B2AA" }}
                    />
                    <Input
                      placeholder="Search by title or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-2xl border-gray-200"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="col-span-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="h-12 rounded-2xl border-gray-200">
                        <SelectValue placeholder="Filter by Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Blog">Blog</SelectItem>
                        <SelectItem value="Quote">Quote</SelectItem>
                        <SelectItem value="Campaign">Campaign</SelectItem>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Podcast">Podcast</SelectItem>
                        <SelectItem value="Image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                  Showing {filteredContent.length} of {contentList.length} content items
                </div>
              </div>

              {/* Content List Table */}
              <div className="bg-white rounded-3xl shadow-lg border-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-100" style={{ backgroundColor: "#f8f8f8" }}>
                        <TableHead className="text-left py-4" style={{ color: "#1C3B5E" }}>
                          Title
                        </TableHead>
                        <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                          Category
                        </TableHead>
                        <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                          Publish Date
                        </TableHead>
                        <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                          Status
                        </TableHead>
                        <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                          End Date
                        </TableHead>
                        <TableHead className="text-center" style={{ color: "#1C3B5E" }}>
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContent.map((content, index) => (
                        <TableRow
                          key={content.id}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                          style={{
                            backgroundColor: index % 2 === 0 ? "white" : "#fafafa",
                          }}
                        >
                          <TableCell className="py-4 max-w-xs">
                            <p className="text-sm mb-1" style={{ color: "#1C3B5E" }}>
                              {content.title}
                            </p>
                            <p className="text-xs truncate" style={{ color: "#333333", opacity: 0.6 }}>
                              {content.description}
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            <div
                              className="inline-block px-3 py-1 rounded-xl text-xs"
                              style={{
                                backgroundColor: "#20B2AA20",
                                color: "#20B2AA",
                              }}
                            >
                              {content.category}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                              {content.publishDate}
                            </p>
                          </TableCell>
                          <TableCell className="text-center">
                            <div
                              className="inline-block px-3 py-1 rounded-xl text-xs"
                              style={{
                                backgroundColor: `${getStatusColor(content.status)}20`,
                                color: getStatusColor(content.status),
                              }}
                            >
                              {content.status}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <p className="text-sm" style={{ color: "#333333", opacity: 0.7 }}>
                              {content.endDate}
                            </p>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-2">
                              {/* Preview */}
                              <button
                                onClick={() => handlePreview(content)}
                                className="p-2 rounded-xl transition-all hover:shadow-md"
                                style={{ backgroundColor: "#20B2AA20" }}
                                title="Preview Content"
                              >
                                <Eye className="w-4 h-4" style={{ color: "#20B2AA" }} />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleEdit(content)}
                                className="p-2 rounded-xl transition-all hover:shadow-md hover:bg-gray-100"
                                title="Edit Content"
                              >
                                <Edit className="w-4 h-4" style={{ color: "#333333" }} />
                              </button>

                              {/* Delete */}
                              <button
                                className="p-2 rounded-xl transition-all hover:shadow-md"
                                style={{ backgroundColor: "#D9534F20" }}
                                title="Delete Content"
                              >
                                <Trash2 className="w-4 h-4" style={{ color: "#D9534F" }} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* No Results Message */}
                {filteredContent.length === 0 && (
                  <div className="py-16 text-center">
                    <p className="text-lg mb-2" style={{ color: "#333333", opacity: 0.7 }}>
                      No content found
                    </p>
                    <p className="text-sm" style={{ color: "#333333", opacity: 0.5 }}>
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Scheduler and Insights */}
            <div className="col-span-4 space-y-6">
              <CampaignScheduler />
              <InsightsNotifications />
            </div>
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
      />
      <PreviewContentModal
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        content={previewContent}
      />
    </div>
  );
}

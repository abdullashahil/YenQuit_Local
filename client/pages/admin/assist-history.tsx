import React, { useState, useEffect } from 'react';
import { Button } from '../../src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Badge } from '../../src/components/ui/badge';
import { Loader2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { getAssistHistory } from '../../src/services/assistService';

interface AssistHistoryItem {
  id: number;
  user_id: number;
  plan_id: number | null;
  coping_strategies: string[];
  triggers: string | null;
  notifications: string; // JSON string
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AssistHistoryPage() {
  const [history, setHistory] = useState<AssistHistoryItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 50, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  useEffect(() => {
    loadHistory(pagination.page);
  }, [pagination.page]);

  const loadHistory = async (page: number) => {
    try {
      setLoading(true);
      const response = await getAssistHistory(page, pagination.limit);
      setHistory(response.data);
      setPagination(prev => ({ ...prev, ...response.pagination }));
    } catch (error) {
      console.error('Error loading assist history:', error);
      alert('Failed to load assist history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const parseNotifications = (notificationsString: string) => {
    try {
      return JSON.parse(notificationsString);
    } catch {
      return [];
    }
  };

  if (loading && history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#20B2AA]" />
          <p>Loading assist history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assist Plan History</h1>
          <p className="text-gray-600">View completed assist plans and user progress</p>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages || loading}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.first_name} {item.last_name}
                      </h3>
                      <Badge variant="outline">{item.email}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Plan completed on {formatDate(item.created_at)}
                    </p>
                    {item.plan_id && (
                      <p className="text-sm text-gray-500">
                        Plan ID: {item.plan_id}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {expandedItem === item.id ? 'Hide' : 'Show'} Details
                  </Button>
                </div>

                {expandedItem === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {/* Coping Strategies */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Coping Strategies</h4>
                      {item.coping_strategies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {item.coping_strategies.map((strategy, index) => (
                            <Badge key={index} variant="secondary">
                              {strategy}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No strategies selected</p>
                      )}
                    </div>

                    {/* Triggers */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Identified Triggers</h4>
                      {item.triggers ? (
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {item.triggers}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">No triggers identified</p>
                      )}
                    </div>

                    {/* Notifications */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Notification Preferences</h4>
                      {(() => {
                        const notifications = parseNotifications(item.notifications);
                        return notifications.length > 0 ? (
                          <div className="space-y-2">
                            {notifications.map((notif: any, index: number) => (
                              <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <span className="font-medium">{notif.template?.title || 'Unknown'}</span>
                                <div className="flex items-center space-x-2">
                                  <Badge variant={notif.enabled ? 'default' : 'secondary'}>
                                    {notif.enabled ? 'Enabled' : 'Disabled'}
                                  </Badge>
                                  {notif.time && (
                                    <span className="text-gray-500">{notif.time}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No notification preferences set</p>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {history.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">No assist plan history found.</p>
          </div>
        )}

        {/* Pagination at bottom */}
        {pagination.pages > 1 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1 || loading}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm bg-gray-100 rounded">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages || loading}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

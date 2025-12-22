import { useState, useEffect } from 'react';
import { Card } from "../../ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import quitTrackerService from "../../../services/quitTrackerService";
import userService from "../../../services/userService";

interface DailyLog {
  id: string | number;
  log_date: string;
  smoked: boolean;
  cigarettes_count?: number;
  cravings_level?: number;
  mood?: number;
  notes?: string;
}

export function ProgressCalendar() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [quitDate, setQuitDate] = useState<string | null>(null);
  const [joinDate, setJoinDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch daily logs data and quit date
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch logs
        const logsResponse = await quitTrackerService.getLogs();
        setLogs(logsResponse.logs || []);

        // Fetch progress data to get quit date
        const progressResponse = await quitTrackerService.getProgress();
        const fullQuitDate = progressResponse.quitDate;
        let quitDateOnly = null;

        if (fullQuitDate) {
          const dateObj = new Date(fullQuitDate);
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          quitDateOnly = `${year}-${month}-${day}`;
        }

        setQuitDate(quitDateOnly);

        // Use joinDate from progress response (which comes from profile) or fallback to assist plan
        let joinDateSource = progressResponse.joinDate;

        if (!joinDateSource && progressResponse.assistPlanData && progressResponse.assistPlanData.updated_at) {
          // Fallback to assist plan date if no profile join date (matching QuitTrackerCard logic)
          joinDateSource = progressResponse.assistPlanData.updated_at;
        }

        if (joinDateSource) {
          // Fix timezone issue: Create date object and use UTC methods or specific locale
          // The issue is likely that split('T')[0] takes the UTC date, but FullCalendar might be using local time
          // converting the ISO string to a Date object first is safer
          const dateObj = new Date(joinDateSource);
          // Format as YYYY-MM-DD using local time
          const year = dateObj.getFullYear();
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const day = String(dateObj.getDate()).padStart(2, '0');
          const joinDateOnly = `${year}-${month}-${day}`;

          console.log('Setting join date from:', joinDateSource, 'to:', joinDateOnly);
          setJoinDate(joinDateOnly);
        }

      } catch (error) {
        // Error fetching data
        console.error("Error fetching calendar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Determine color based on log data
  const getLogColor = (log: DailyLog) => {
    if (log.smoked) {
      return '#ff0800ff'; // Red for smoked days
    } else {
      // Non-smoke days - check cravings and mood
      const cravings = log.cravings_level || 5; // Default to medium if not set
      const mood = log.mood || 5; // Default to medium if not set

      // High cravings (7-10) OR bad mood (1-3) = teal color
      if (cravings >= 7 || mood <= 3) {
        return '#20B2AA'; // Teal for non-smoke days with high cravings/bad mood
      } else {
        return '#48ff00ff'; // Green for non-smoke days with low cravings/good mood
      }
    }
  };

  // Create events for calendar based on logs
  const calendarEvents = logs.map(log => {
    const color = getLogColor(log);
    return {
      start: log.log_date,
      allDay: true,
      display: 'background',
      backgroundColor: color,
    };
  });

  // Add quit date event if it exists
  if (quitDate) {
    calendarEvents.push({
      start: quitDate,
      allDay: true,
      display: 'background',
      backgroundColor: 'transparent',
    });
  }

  // Handle day cell rendering to highlight quit date and start date
  const handleDayCellDidMount = (info: any) => {
    // Fix: Use dateStr from FullCalendar or manually format local date to avoid UTC shift
    // toISOString() converts 00:00 local to previous day UTC (e.g. 18:30 previous day)
    let cellDate = info.dateStr;
    if (!cellDate && info.date) {
      const year = info.date.getFullYear();
      const month = String(info.date.getMonth() + 1).padStart(2, '0');
      const day = String(info.date.getDate()).padStart(2, '0');
      cellDate = `${year}-${month}-${day}`;
    }

    // Highlight start date (join_date) in green
    if (joinDate && cellDate === joinDate) {
      console.log('Start date found:', joinDate);
      info.el.style.boxSizing = 'border-box';
      info.el.style.zIndex = '10';
      info.el.style.position = 'relative';
      info.el.style.color = 'rgba(32, 178, 170, 1)';
      info.el.style.fontWeight = 'bold';
      info.el.style.fontSize = '160%';
      info.el.style.textShadow = '0 0 3px rgba(172, 247, 242, 1)';
    }

    // Highlight quit date in red
    if (quitDate && cellDate === quitDate) {
      info.el.style.boxSizing = 'border-box';
      info.el.style.zIndex = '10';
      info.el.style.position = 'relative';
      info.el.style.color = '#ff0000ff';
      info.el.style.fontWeight = 'bold';
      info.el.style.fontSize = '160%';
      info.el.style.textShadow = '0 0 3px rgba(255, 0, 0, 0.5)';
    }
  };

  // Force re-render when dates change
  useEffect(() => {
    // console.log('Dates updated, calendar should re-render');
  }, [quitDate, joinDate]);

  return (
    <Card className="rounded-2xl shadow-sm border border-gray-100 w-full bg-white">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-semibold text-gray-900">Progress Calendar</h3>
        </div>

        <div className="relative bg-white rounded-lg border border-gray-200">
          <FullCalendar
            key={quitDate || 'no-quit-date'}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: 'title',
              center: '',
              end: 'prev,next'
            }}
            dayHeaderFormat={{ weekday: 'short' }}
            height="auto"
            aspectRatio={1.5}
            events={calendarEvents}
            dayCellDidMount={handleDayCellDidMount}
          />
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#8BC34A' }}></div>
            <span className="text-xs text-gray-600">Good Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#20B2AA' }}></div>
            <span className="text-xs text-gray-600">High Cravings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: '#f78c89ff' }}></div>
            <span className="text-xs text-gray-600">Smoked</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
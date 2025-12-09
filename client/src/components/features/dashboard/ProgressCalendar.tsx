import { useState, useEffect } from 'react';
import { Card } from "../../ui/card";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import quitTrackerService from "../../../services/quitTrackerService";

interface DailyLog {
  id: string;
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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch daily logs data and quit date
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch logs
        const logsResponse = await quitTrackerService.getLogs();
        // console.log('Logs response:', logsResponse);
        setLogs(logsResponse.logs || []);
        
        // Fetch progress data to get quit date
        const progressResponse = await quitTrackerService.getProgress();
         // console.log('Progress response:', progressResponse);
        // Extract just the date part from the ISO string
        const fullQuitDate = progressResponse.quitDate;
        const quitDateOnly = fullQuitDate ? fullQuitDate.split('T')[0] : null;
        // console.log('Quit date only:', quitDateOnly);
        setQuitDate(quitDateOnly);
      } catch (error) {
        // Error fetching data
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

  // Remove date click handler to disable modal popup
  // const handleDateClick = (arg: any) => {
  //   // Removed to prevent modal popup
  // };

  // Handle day cell rendering to highlight quit date and start date
  const handleDayCellDidMount = (info: any) => {
    // console.log('Day cell mounted - date:', info.date, 'dateStr:', info.dateStr, 'Quit date:', quitDate);
    // Try different properties to get the date
    const cellDate = info.dateStr || (info.date && info.date.toISOString().split('T')[0]);
    // console.log('Cell date to check:', cellDate);
    // console.log('Logs array:', logs);
    // console.log('Logs length:', logs.length);
    
    if (logs.length > 0) {
      const lastLogDate = logs[logs.length - 1].log_date.split('T')[0]; // Extract date part only
      // console.log('Last log date (original):', logs[logs.length - 1].log_date);
      // console.log('Last log date (extracted):', lastLogDate);
      // console.log('Date comparison:', cellDate, '===', lastLogDate, '=', cellDate === lastLogDate);
      
      // Highlight start date (first log date) in green
      if (cellDate === lastLogDate) {
        console.log('Start date found:', lastLogDate);
        info.el.style.boxSizing = 'border-box';
        info.el.style.zIndex = '10';
        info.el.style.position = 'relative';
        info.el.style.color = '#1C3B5E';
        info.el.style.fontWeight = 'bold';
        info.el.style.fontSize = '160%';
        info.el.style.textShadow = '0 0 3px rgba(0, 6, 61, 0.5)';
      }
    }
    
    // Highlight quit date in red
    if (quitDate && cellDate === quitDate) {
      // console.log('Applying red styling to quit date:', cellDate);
      info.el.style.boxSizing = 'border-box';
      info.el.style.zIndex = '10';
      info.el.style.position = 'relative';
      info.el.style.color = '#ff0000ff';
      info.el.style.fontWeight = 'bold';
      info.el.style.fontSize = '160%';
      info.el.style.textShadow = '0 0 3px rgba(255, 0, 0, 0.5)';
    }
  };

  // Force re-render when quit date changes
  useEffect(() => {
    if (quitDate) {
      // console.log('Quit date updated, calendar should re-render');
    }
  }, [quitDate]);

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
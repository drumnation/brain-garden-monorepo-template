/**
 * Represents a calendar event
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a new calendar event
 */
export interface CalendarEventInput {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
}

/**
 * Input for updating an existing calendar event
 */
export type CalendarEventUpdate = Partial<CalendarEventInput>;

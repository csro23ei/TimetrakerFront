
export interface Task {
    id: string;
    taskName: string;
    time: number;
    taskDate: string; // ISO date string format
    deleted: boolean;
  }
  
  export interface NewTask {
    taskName: string;
    time: number;
    deleted: boolean;
  }
  
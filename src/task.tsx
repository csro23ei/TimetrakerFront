
export interface Task {
    id: string;
    taskName: string;
    time: number;
    taskDate: string; 
    deleted: boolean;
  }
  
  export interface NewTask {
    taskName: string;
    time: number;
    deleted: boolean;
  }
  
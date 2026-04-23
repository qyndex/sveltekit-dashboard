export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: "admin" | "editor" | "viewer";
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: "admin" | "editor" | "viewer";
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: "admin" | "editor" | "viewer";
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      metrics: {
        Row: {
          id: string;
          metric_name: string;
          value: number;
          period: string | null;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          metric_name: string;
          value: number;
          period?: string | null;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          metric_name?: string;
          value?: number;
          period?: string | null;
          recorded_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          details: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          details?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          details?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

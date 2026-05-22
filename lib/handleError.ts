import { toast } from "sonner";

interface ErrorResponse {
  data?: {
    success: false;
    error: {
      code: string;
      status: number;
      message: string;
      details?: Record<string, string>;
    };
  };
}

export const handleError = (error: unknown) => {
  const err = error as ErrorResponse;
  
  if (err.data?.error?.message) {
    toast.error(err.data.error.message);
    
    // Log details if they exist for debugging
    if (err.data.error.details) {
      console.error("Error details:", err.data.error.details);
    }
  } else {
    toast.error("An unexpected error occurred. Please try again.");
    console.error("Unknown error:", error);
  }
};

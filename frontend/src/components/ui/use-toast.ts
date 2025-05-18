import { toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant = "default",
      duration = 3000,
    }: {
      title: string
      description?: string
      variant?: "default" | "destructive" | "success"
      duration?: number
    }) => {
      sonnerToast[variant === "destructive" ? "error" : variant === "success" ? "success" : "message"](title, {
        description,
        duration,
      })
    },
  }
}

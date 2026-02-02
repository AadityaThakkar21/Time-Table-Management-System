import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFiles() {
  return useQuery({
    queryKey: [api.files.list.path],
    queryFn: async () => {
      const res = await fetch(api.files.list.path);
      if (!res.ok) throw new Error("Failed to fetch files");
      return api.files.list.responses[200].parse(await res.json());
    },
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(api.files.upload.path, {
        method: api.files.upload.method,
        body: formData,
      });

      if (!res.ok) {
        // Try to parse validation error
        try {
          const errorData = await res.json();
          if (res.status === 400) {
            const parsed = api.files.upload.responses[400].parse(errorData);
            throw new Error(parsed.message);
          }
          if (res.status === 500) {
            const parsed = api.files.upload.responses[500].parse(errorData);
            throw new Error(parsed.message);
          }
        } catch (e) {
          // Fallback if parsing fails or it's a different error
        }
        throw new Error("Failed to upload file. Please ensure it is a valid Excel file.");
      }

      return api.files.upload.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.files.list.path] });
      toast({
        title: "Success!",
        description: "Your timetable has been generated successfully.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function getDownloadUrl(id: number) {
  return buildUrl(api.files.download.path, { id });
}

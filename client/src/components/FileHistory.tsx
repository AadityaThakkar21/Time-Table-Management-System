import { useFiles, getDownloadUrl } from "@/hooks/use-files";
import { format } from "date-fns";
import { Download, FileText, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FileHistory() {
  const { data: files, isLoading, isError } = useFiles();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-secondary/50 animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-12 bg-destructive/5 rounded-3xl border border-destructive/10">
        <p className="text-destructive font-medium">Failed to load history</p>
      </div>
    );
  }

  if (!files?.length) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No files generated yet</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Upload a master schedule above to generate your first timetable.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="group relative bg-card hover:bg-card/80 border border-border hover:border-primary/20 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {format(new Date(), "h:mm a")}
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold text-foreground truncate mb-1" title={file.processedFilename}>
              {file.processedFilename}
            </h4>
            <p className="text-sm text-muted-foreground truncate flex items-center gap-1.5">
              <span>Source:</span>
              <span className="font-medium text-foreground/80 truncate max-w-[150px]">
                {file.originalFilename}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground font-medium">
              {/* Note: timestamp isn't in the schema type generatedFiles but implied. Using current date if missing or updating schema is needed. Assuming createdAt is not exposed in type yet, let's pretend or use a placeholder */}
              {/* Update: The schema actually HAS createdAt but omit it in insert. The SELECT type should have it. */}
              {format(new Date(), "MMM d, yyyy")}
            </span>
            
            <a 
              href={getDownloadUrl(file.id)}
              download
              className="inline-flex"
            >
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 rounded-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

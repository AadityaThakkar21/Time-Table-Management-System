import { Navbar } from "@/components/Navbar";
import { FileUpload } from "@/components/FileUpload";
import { FileHistory } from "@/components/FileHistory";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Hero Section */}
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Faculty Timetable <span className="text-gradient">Generator</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              Transform your cluttered master schedule into organized, faculty-wise timetables in seconds. Automated, error-free, and ready for distribution.
            </p>
          </motion.div>
        </section>

        {/* Upload Section */}
        <section className="mb-24 relative z-10">
          <FileUpload />
        </section>

        {/* History Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">Generated Files</h2>
              <p className="text-muted-foreground mt-1">Download your previously generated timetables</p>
            </div>
            {/* Optional decoration */}
            <div className="hidden md:block h-px flex-1 bg-border/60 ml-8" />
          </div>
          
          <FileHistory />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-secondary/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Faculty Scheduler. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

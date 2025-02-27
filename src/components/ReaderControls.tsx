
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Menu, X, ChevronLeft, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chapter } from "@/lib/types";
import { Link } from "react-router-dom";

interface ReaderControlsProps {
  mangaId: string;
  chapter: Chapter;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onExit: () => void;
}

export default function ReaderControls({
  mangaId,
  chapter,
  currentPage,
  totalPages,
  onPageChange,
  onExit,
}: ReaderControlsProps) {
  const [showControls, setShowControls] = useState(true);
  const [controlsTimer, setControlsTimer] = useState<NodeJS.Timeout | null>(null);
  const [showPageSelector, setShowPageSelector] = useState(false);

  // Handles auto-hiding the controls
  useEffect(() => {
    const startTimer = () => {
      if (controlsTimer) clearTimeout(controlsTimer);
      
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimer(timer);
    };

    if (showControls && !showPageSelector) {
      startTimer();
    }

    return () => {
      if (controlsTimer) clearTimeout(controlsTimer);
    };
  }, [showControls, showPageSelector]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "h") {
        goToPreviousPage();
      } else if (e.key === "ArrowRight" || e.key === "l") {
        goToNextPage();
      } else if (e.key === "Escape") {
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, totalPages]);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
      setShowControls(true);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
      setShowControls(true);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  return (
    <div 
      className="fixed inset-0 z-20 pointer-events-none"
      onMouseMove={handleMouseMove}
    >
      {/* Top bar */}
      <div 
        className={`fixed top-0 left-0 right-0 glass-morphism p-4 flex items-center justify-between pointer-events-auto transition-transform duration-300 ${
          showControls ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
          onClick={onExit}
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </Button>
        <div className="text-white/90 text-sm md:text-base">
          Chapter {chapter.number} - Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
          onClick={() => setShowPageSelector(!showPageSelector)}
        >
          <LayoutGrid size={20} />
        </Button>
      </div>

      {/* Page selector overlay */}
      {showPageSelector && (
        <div className="fixed inset-0 bg-black/80 z-30 pointer-events-auto animate-fade-in">
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white">Chapter {chapter.number} Pages</h2>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => setShowPageSelector(false)}
              >
                <X size={20} />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={`aspect-[2/3] rounded-lg overflow-hidden border-2 transition-all ${
                    currentPage === index + 1
                      ? "border-white scale-105 shadow-lg"
                      : "border-transparent hover:border-white/50"
                  }`}
                  onClick={() => {
                    onPageChange(index + 1);
                    setShowPageSelector(false);
                  }}
                >
                  <img
                    src={chapter.pages[index]}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-center text-sm text-white">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Left area for previous page */}
      <div
        className="fixed top-[20%] bottom-[20%] left-0 w-1/4 flex items-center justify-start px-4 pointer-events-auto"
        onClick={goToPreviousPage}
      >
        <div 
          className={`w-12 h-12 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            showControls ? "opacity-50 hover:opacity-80" : "opacity-0"
          }`}
        >
          <ArrowLeft size={20} className="text-white" />
        </div>
      </div>

      {/* Right area for next page */}
      <div
        className="fixed top-[20%] bottom-[20%] right-0 w-1/4 flex items-center justify-end px-4 pointer-events-auto"
        onClick={goToNextPage}
      >
        <div 
          className={`w-12 h-12 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            showControls ? "opacity-50 hover:opacity-80" : "opacity-0"
          }`}
        >
          <ArrowRight size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}

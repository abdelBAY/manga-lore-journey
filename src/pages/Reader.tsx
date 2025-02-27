
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMangaById, useChapterById, useChaptersByMangaId } from "@/hooks/useManga";
import ReaderControls from "@/components/ReaderControls";

export default function Reader() {
  const { mangaId, chapterId } = useParams<{ mangaId: string; chapterId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Fetch manga and chapter data
  const { data: manga } = useMangaById(mangaId || "");
  const { data: chapter, isLoading: isLoadingChapter } = useChapterById(
    mangaId || "",
    chapterId || ""
  );
  const { data: allChapters } = useChaptersByMangaId(mangaId || "");
  
  // Reset page when changing chapters
  useEffect(() => {
    setCurrentPage(1);
    setIsImageLoaded(false);
  }, [chapterId]);
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "h") {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
          setIsImageLoaded(false);
        }
      } else if (e.key === "ArrowRight" || e.key === "l") {
        if (chapter && currentPage < chapter.pages.length) {
          setCurrentPage(currentPage + 1);
          setIsImageLoaded(false);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, chapter]);
  
  // Handle back navigation
  const handleExit = () => {
    navigate(`/manga/${mangaId}`);
  };
  
  // Loading state
  if (isLoadingChapter || !chapter) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Reader area */}
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className={`${isImageLoaded ? "" : "image-loading absolute inset-0"}`} />
        {chapter && (
          <img
            src={chapter.pages[currentPage - 1]}
            alt={`Page ${currentPage}`}
            className={`max-h-screen max-w-full object-contain transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
        )}
      </div>
      
      {/* Controls */}
      <ReaderControls
        mangaId={mangaId || ""}
        chapter={chapter}
        currentPage={currentPage}
        totalPages={chapter.pages.length}
        onPageChange={setCurrentPage}
        onExit={handleExit}
      />
    </div>
  );
}

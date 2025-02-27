
import { useState } from "react";
import { Link } from "react-router-dom";
import { Chapter } from "@/lib/types";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ChapterListProps {
  chapters: Chapter[];
  mangaId: string;
  isLoading?: boolean;
}

export default function ChapterList({ 
  chapters, 
  mangaId, 
  isLoading = false 
}: ChapterListProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleChapters = showAll ? chapters : chapters.slice(0, 10);
  
  // Sort chapters by number in descending order (newest first)
  const sortedChapters = [...visibleChapters].sort((a, b) => b.number - a.number);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-white/5 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (chapters.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/70">No chapters available yet.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {sortedChapters.map((chapter) => (
          <Link
            key={chapter.id}
            to={`/manga/${mangaId}/chapter/${chapter.id}`}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/10 rounded-md flex items-center justify-center text-white/70 group-hover:text-white transition-colors">
                <BookOpen size={20} />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-white group-hover:text-white transition-colors">
                  Chapter {chapter.number}
                </h4>
                <p className="text-sm text-white/60">
                  {format(new Date(chapter.releaseDate), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
            <div className="text-white/60 text-sm mr-2 group-hover:translate-x-0 transition-transform">
              Read
            </div>
          </Link>
        ))}
      </div>
      
      {chapters.length > 10 && (
        <Button
          variant="outline"
          className="w-full border-white/20 text-white hover:bg-white/10"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <>
              <ChevronUp size={16} className="mr-2" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} className="mr-2" /> Show All Chapters
            </>
          )}
        </Button>
      )}
    </div>
  );
}

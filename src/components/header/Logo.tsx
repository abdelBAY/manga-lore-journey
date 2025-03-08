
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
      <BookOpen className="w-6 h-6" />
      <span>MangaLore</span>
    </Link>
  );
}

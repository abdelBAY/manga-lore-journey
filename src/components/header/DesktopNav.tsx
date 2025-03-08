
import { Link } from "react-router-dom";

interface NavLinkProps {
  path: string;
  label: string;
}

interface DesktopNavProps {
  navLinks: NavLinkProps[];
  isActiveLink: (path: string) => boolean;
}

export default function DesktopNav({ navLinks, isActiveLink }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={`text-sm font-medium transition-colors ${
            isActiveLink(link.path)
              ? "text-white"
              : "text-white/60 hover:text-white"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

import { useState, useEffect } from "react";

export function useScrollSpy(sectionIds, offset = 150) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      
      // If we are at the very bottom of the page, highlight the last section
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
        setActiveId(sectionIds[sectionIds.length - 1]);
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}

import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} — RooftopGarden`;
    return () => {
      document.title = "RooftopGarden";
    };
  }, [title]);
}

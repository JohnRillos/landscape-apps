import { useCallback, useState } from 'react';
import { useBriefs } from '../state/chat';
import { ChatWhom } from '../types/chat';

const ALPHABETICAL = 'A → Z';
const RECENT = 'Recent';

export default function useSidebarSort() {
  const briefs = useBriefs();
  const sortRecent = useCallback(
    (a: ChatWhom, b: ChatWhom) => {
      const aLast = briefs[a]?.last ?? Number.NEGATIVE_INFINITY;
      const bLast = briefs[b]?.last ?? Number.NEGATIVE_INFINITY;
      if (aLast < bLast) {
        return -1;
      }
      if (aLast > bLast) {
        return 1;
      }
      return 0;
    },
    [briefs]
  );

  const sortAlphabetical = (a: ChatWhom, b: ChatWhom) => a.localeCompare(b);

  const [sortFn, setSortFn] = useState<string>(ALPHABETICAL);
  const sortOptions: Record<
    string,
    typeof sortRecent | typeof sortAlphabetical
  > = {
    [ALPHABETICAL]: sortAlphabetical,
    [RECENT]: sortRecent,
  };

  return {
    setSortFn,
    sortFn,
    sortOptions,
  };
}

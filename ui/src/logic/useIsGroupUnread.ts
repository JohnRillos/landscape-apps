import { useCallback } from 'react';
import { useGroups } from '@/state/groups';
import { useCheckChannelUnread } from './useIsChannelUnread';

export default function useIsGroupUnread() {
  const groups = useGroups();
  const isChannelUnread = useCheckChannelUnread();

  /**
   * A Group is unread if
   * - any of it's Channels have new items in their corresponding briefs
   * - any of its Channels are unread (bin is unread, rope channel matches
   *   chFlag)
   */
  const isGroupUnread = useCallback(
    (flag: string) => {
      const group = groups[flag];
      const chNests = group ? Object.keys(group.channels) : [];

      return chNests.reduce(
        (memo, nest) => memo || isChannelUnread(nest),
        false
      );
    },
    [groups, isChannelUnread]
  );

  return {
    isGroupUnread,
  };
}

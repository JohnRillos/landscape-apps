import React from 'react';
import { useLocation } from 'react-router';
import ActivityIndicator from '@/components/Sidebar/ActivityIndicator';
import MobileSidebar from '@/components/Sidebar/MobileSidebar';
import GroupList from '@/components/Sidebar/GroupList';
import { useGroups, usePendingInvites } from '@/state/groups';
import { useIsMobile } from '@/logic/useMedia';
import AppGroupsIcon from '@/components/icons/AppGroupsIcon';
import MagnifyingGlass from '@/components/icons/MagnifyingGlass16Icon';
import SidebarItem from '@/components/Sidebar/SidebarItem';
import AddIcon16 from '@/components/icons/Add16Icon';
import SidebarSorter from '@/components/Sidebar/SidebarSorter';
import { usePinnedGroups } from '@/state/chat';
import { hasKeys } from '@/logic/utils';
import ShipName from '@/components/ShipName';
import Avatar, { useProfileColor } from '@/components/Avatar';
import useGroupSort from '@/logic/useGroupSort';
import { useNotifications } from '@/notifications/useNotifications';

export default function Sidebar() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const pendingInvites = usePendingInvites();

  const pendingInvitesCount = pendingInvites.length;
  const { count } = useNotifications();

  const { sortFn, setSortFn, sortOptions, sortGroups } = useGroupSort();
  const groups = useGroups();
  const pinnedGroups = usePinnedGroups();
  const sortedGroups = sortGroups(groups);
  const sortedPinnedGroups = sortGroups(pinnedGroups);
  const shipColor = useProfileColor(window.our);

  if (isMobile) {
    return <MobileSidebar />;
  }

  return (
    <nav className="flex h-full w-64 flex-col bg-white">
      <ul className="flex w-full flex-col px-2 pt-2">
        {/* TODO: FETCH WINDOW.OUR WITHOUT IT RETURNING UNDEFINED */}
        <SidebarItem
          div
          className="text-black"
          to="/"
          icon={<AppGroupsIcon className="h-6 w-6" />}
        >
          Groups
        </SidebarItem>
        <div className="h-5" />
        <SidebarItem
          highlight={shipColor}
          icon={<Avatar size="xs" ship={window.our} />}
          to={'/profile/edit'}
        >
          <ShipName showAlias name={window.our} />
        </SidebarItem>
        <SidebarItem
          icon={<ActivityIndicator count={count} />}
          to={`/notifications`}
        >
          Notifications
        </SidebarItem>
        <SidebarItem
          icon={<MagnifyingGlass className="m-1 h-4 w-4" />}
          to="/groups/find"
        >
          <div className="flex items-center">
            Find Groups
            {pendingInvitesCount > 0 ? (
              <span className="ml-auto font-semibold text-blue">
                {pendingInvitesCount}
              </span>
            ) : null}
          </div>
        </SidebarItem>
        <SidebarItem
          icon={<AddIcon16 className="m-1 h-4 w-4" />}
          to="/groups/new"
          state={{ backgroundLocation: location }}
        >
          Create Group
        </SidebarItem>
        {hasKeys(pinnedGroups) ? (
          <GroupList
            className="flex-1 overflow-y-scroll pr-0"
            pinned
            groups={sortedGroups}
            pinnedGroups={sortedPinnedGroups}
          />
        ) : null}
        <li className="-mx-2 mt-5 grow border-t-2 border-gray-50 pt-3 pb-2">
          <span className="ml-4 text-sm font-semibold text-gray-400">
            All Groups
          </span>
        </li>
        <li className="relative p-2">
          <SidebarSorter
            sortFn={sortFn}
            setSortFn={setSortFn}
            sortOptions={sortOptions}
            isMobile={isMobile}
          />
        </li>
      </ul>
      <GroupList
        className="flex-1 overflow-x-hidden overflow-y-scroll pr-0 pt-0"
        groups={sortedGroups}
        pinnedGroups={sortedPinnedGroups}
      />
    </nav>
  );
}

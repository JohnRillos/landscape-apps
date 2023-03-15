import React from 'react';
import cn from 'classnames';
import { Outlet, useMatch } from 'react-router';
import { useGroup, useGroupFlag } from '@/state/groups/groups';
import NavTab from '@/components/NavTab';
import HashIcon from '@/components/icons/HashIcon';
import ElipsisIcon from '@/components/icons/EllipsisIcon';
import BellIcon from '@/components/icons/BellIcon';
import GroupAvatar from '../GroupAvatar';

export default function MobileGroupSidebar() {
  const flag = useGroupFlag();
  const group = useGroup(flag);
  const match = useMatch('/groups/:ship/:name/info');

  return (
    <section className="flex h-full w-full flex-col overflow-x-hidden  bg-white">
      <Outlet />
      <footer className="mt-auto flex-none border-t-2 border-gray-50">
        <nav>
          <ul className="flex items-center">
            <NavTab to={`.`} className="basis-1/4">
              <HashIcon className="mb-0.5 h-6 w-6" />
              Channels
            </NavTab>
            <NavTab to={`/groups/${flag}/activity`} className="basis-1/4">
              <BellIcon className="mb-0.5 h-6 w-6" />
              Activity
            </NavTab>
            <NavTab to={`/groups/${flag}/info`} className="basis-1/4">
              <GroupAvatar
                {...group?.meta}
                size="h-6 w-6"
                className={cn('mb-0.5', !match && 'opacity-50 grayscale')}
              />
              Group Info
            </NavTab>
            <NavTab to={`/groups/${flag}/actions`} className="basis-1/4">
              <ElipsisIcon className="mb-0.5 h-6 w-6" />
              Options
            </NavTab>
          </ul>
        </nav>
      </footer>
    </section>
  );
}

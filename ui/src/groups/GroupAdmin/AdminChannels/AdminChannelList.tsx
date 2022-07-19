import React from 'react';
import { useGroup, useRouteGroup } from '@/state/groups';
import { SectionMap } from './types';
import AdminChannelListDropContext from './AdminChannelListDropContext';

export default function AdminChannelList() {
  const flag = useRouteGroup();
  const group = useGroup(flag);
  const sectionedChannels: SectionMap = {
    sectionless: {
      title: 'Sectionless',
      channels: [],
    },
  };

  if (!group) {
    return null;
  }

  Object.entries(group.channels).forEach(([key, channel]) => {
    Object.keys(sectionedChannels).forEach((channelKey) => {
      if (
        (sectionedChannels[channelKey].title === 'Sectionless' &&
          channel.zone === '') ||
        channel.zone === null
      ) {
        sectionedChannels[channelKey].channels.push({ key, channel });
      } else if (sectionedChannels[channelKey].title === channel.zone) {
        sectionedChannels[channelKey].channels.push({ key, channel });
      } else {
        sectionedChannels[channelKey] = {
          title: channel.zone,
          channels: [{ key, channel }],
        };
      }
    });
  });

  return <AdminChannelListDropContext sectionedChannels={sectionedChannels} />;
}
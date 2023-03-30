import React from 'react';
import cn from 'classnames';
import { isColor } from '@/logic/utils';
import { useAvatar } from '@/state/avatar';
import Avatar from '@/components/Avatar';
import GroupAvatar from '@/groups/GroupAvatar';

export type MultiDmAvatarSize = 'xs' | 'small' | 'default' | 'huge';

interface MultiDmAvatarProps {
  members?: string[];
  image?: string;
  color?: string;
  size?: MultiDmAvatarSize;
  className?: string;
  title?: string;
  loadImage?: boolean;
}

const sizeMap = {
  xs: {
    size: 'h-6 w-6 rounded',
    iconSize: 'h-6 w-6',
  },
  small: {
    size: 'h-8 w-8 rounded',
    iconSize: 'h-6 w-6',
  },
  default: {
    size: 'h-12 w-12 rounded-lg',
    iconSize: 'h-8 w-8',
  },
  huge: {
    size: 'h-20 w-20 rounded-xl',
    iconSize: 'h-8 w-8',
  },
};

export default function MultiDmAvatar({
  members,
  image,
  color,
  size = 'default',
  className,
  title,
  loadImage = true,
}: MultiDmAvatarProps) {
  const { hasLoaded, load } = useAvatar(image || '');
  const showImage = hasLoaded || loadImage;

  const avatarList = (ships: Array<string>) =>
    ships.map(
      (member: string, i: number) =>
        i < 4 && (
          <div key={member} className="flex items-center justify-center">
            <Avatar key={member} ship={member} size="xxs" />
          </div>
        )
    );

  function avatarGrid() {
    return (
      <div className="grid h-12 w-12 grid-cols-2 grid-rows-2 rounded-lg border-2 border-gray-50 sm:h-6 sm:w-6 sm:rounded">
        {members && avatarList(members)}
      </div>
    );
  }

  if (image && isColor(image)) {
    return (
      <GroupAvatar
        size={sizeMap[size].size}
        image={image}
        title={title}
        loadImage={loadImage}
      />
    );
  }

  if (image && showImage) {
    return (
      <img
        className={cn(sizeMap[size].size, className)}
        src={image}
        onLoad={load}
      />
    );
  }

  return (
    <div className={cn(sizeMap[size].size, className)}>{avatarGrid()}</div>
  );
}

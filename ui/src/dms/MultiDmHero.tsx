import React from 'react';
import cn from 'classnames';
import { Club } from '@/types/chat';
import { pluralize } from '@/logic/utils';
import ShipName from '@/components/ShipName';
import Avatar from '@/components/Avatar';

interface MultiDMHeroProps {
  club: Club;
}

export default function MultiDmHero({ club }: MultiDMHeroProps) {
  const count = club.team.length;
  const pendingCount = club.hive.length;
  const hasPending = pendingCount > 0;

  const shipList = (ships: Array<string>) =>
    ships.map((member: string, i: number) => {
      let sep;
      if (i !== ships.length - 1) {
        sep = ', ';
      }
      return (
        <span key={member}>
          <ShipName name={member} showAlias />
          {sep ? <span>{sep}</span> : null}
        </span>
      );
    });

  const avatarList = (ships: Array<string>) =>
    ships.map(
      (member: string, i: number) =>
        i < 4 && (
          <div key={member} className="flex items-center justify-center">
            <Avatar key={member} ship={member} size="small" />
          </div>
        )
    );

  function avatarGrid() {
    return (
      <div className="grid h-20 w-20 grid-cols-2 grid-rows-2 rounded-lg border-2 border-gray-50 bg-white">
        {avatarList(club.team.concat(club.hive))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {avatarGrid()}
      {club.meta.title ? (
        <h2 className="mb-1 mt-2 text-lg font-semibold">{club.meta.title}</h2>
      ) : null}
      <div
        className={cn(
          'mb-1 max-w-md text-center font-semibold',
          club.meta.title && 'text-gray-600'
        )}
      >
        {shipList(club.team.concat(club.hive))}
      </div>
      <div className="text-gray-600">
        <span>{`${count} ${pluralize('Member', count)}${
          hasPending ? ',' : ''
        }`}</span>
        {hasPending ? (
          <span className="text-blue"> {pendingCount} Pending</span>
        ) : null}
      </div>
    </div>
  );
}

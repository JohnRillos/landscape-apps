/* eslint-disable react/no-unused-prop-types */
import React, { useCallback, useRef, useState } from 'react';
import cn from 'classnames';
import _, { debounce } from 'lodash';
import f from 'lodash/fp';
import { BigInteger } from 'big-integer';
import { daToUnix } from '@urbit/api';
import { format, formatDistanceToNow, formatRelative, isToday } from 'date-fns';
import { NavLink } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ChatBrief, ChatWrit } from '@/types/chat';
import Author from '@/chat/ChatMessage/Author';
// eslint-disable-next-line import/no-cycle
import ChatContent from '@/chat/ChatContent/ChatContent';
import ChatReactions from '@/chat/ChatReactions/ChatReactions';
import DateDivider from '@/chat/ChatMessage/DateDivider';
import ChatMessageOptions from '@/chat/ChatMessage/ChatMessageOptions';
import {
  usePact,
  useChatState,
  useIsMessageDelivered,
  useIsMessagePosted,
  useWrit,
} from '@/state/chat';
import Avatar from '@/components/Avatar';
import DoubleCaretRightIcon from '@/components/icons/DoubleCaretRightIcon';
import UnreadIndicator from '@/components/Sidebar/UnreadIndicator';
import { whomIsDm, whomIsMultiDm } from '@/logic/utils';
import { useChatHovering, useChatInfo, useChatStore } from '../useChatStore';

export interface ChatMessageProps {
  whom: string;
  time: BigInteger;
  writ: ChatWrit;
  newAuthor?: boolean;
  newDay?: boolean;
  hideReplies?: boolean;
  hideOptions?: boolean;
  isLast?: boolean;
  isLinked?: boolean;
  isScrolling?: boolean;
}

function briefMatches(brief: ChatBrief, id: string): boolean {
  return brief['read-id'] === id;
}

const mergeRefs =
  (...refs: any[]) =>
  (node: any) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      /* eslint-disable-next-line no-param-reassign */
      ref.current = node;
    });
  };

const ChatMessage = React.memo<
  ChatMessageProps & React.RefAttributes<HTMLDivElement>
>(
  React.forwardRef<HTMLDivElement, ChatMessageProps>(
    (
      {
        whom,
        time,
        writ,
        newAuthor = false,
        newDay = false,
        hideReplies = false,
        hideOptions = false,
        isLast = false,
        isLinked = false,
        isScrolling = false,
      }: ChatMessageProps,
      ref
    ) => {
      const { seal, memo } = writ;
      const container = useRef<HTMLDivElement>(null);
      const chatInfo = useChatInfo(whom);
      const unread = chatInfo?.unread;
      const unreadId = unread?.brief['read-id'];
      const { hovering, setHovering } = useChatHovering(whom, writ.seal.id);
      const { ref: viewRef } = useInView({
        threshold: 1,
        onChange: useCallback(
          (inView) => {
            // if no tracked unread we don't need to take any action
            if (!unread) {
              return;
            }

            const { brief, seen } = unread;
            /* the first fire of this function
               which we don't to do anything with. */
            if (!inView && !seen) {
              return;
            }

            const {
              seen: markSeen,
              read,
              delayedRead,
            } = useChatStore.getState();
            const { markRead } = useChatState.getState();

            /* once the unseen marker comes into view we need to mark it
               as seen and start a timer to mark it read so it goes away.
               we ensure that the brief matches and hasn't changed before
               doing so. we don't want to accidentally clear unreads when
               the state has changed
            */
            if (inView && briefMatches(brief, writ.seal.id) && !seen) {
              markSeen(whom);
              delayedRead(whom, () => markRead(whom));
              return;
            }

            /* finally, if the marker transitions back to not being visible,
              we can assume the user is done and clear the unread. */
            if (!inView && unread && seen) {
              read(whom);
              markRead(whom);
            }
          },
          [unread, whom, writ.seal.id]
        ),
      });
      const isMessageDelivered = useIsMessageDelivered(seal.id);
      const isMessagePosted = useIsMessagePosted(seal.id);
      const isReplyOp = chatInfo?.replying === writ.seal.id;

      const unix = new Date(daToUnix(time));

      const pact = usePact(whom);

      const numReplies = seal.replied.length;
      const repliesContainsUnreadId = unreadId
        ? seal.replied.includes(unreadId)
        : false;
      const replyAuthors = _.flow(
        f.map((k: string) => {
          const t = pact?.index[k];
          const mess = t ? pact.writs.get(t) : undefined;
          if (!mess) {
            return undefined;
          }
          return mess.memo.author;
        }),
        f.compact,
        f.uniq,
        f.take(3)
      )(seal.replied);
      const lastReply = seal.replied.length ? _.last(seal.replied)! : '';
      const lastReplyWrit = useWrit(whom, lastReply)!;
      const lastReplyTime = lastReplyWrit
        ? new Date(daToUnix(lastReplyWrit[0]))
        : new Date();

      const hover = useRef(false);
      const setHover = useRef(
        debounce(() => {
          if (hover.current) {
            setHovering(true);
          }
        }, 100)
      );
      const onOver = useCallback(() => {
        if (hover.current === false) {
          hover.current = true;
          setHover.current();
        }
      }, []);
      const onOut = useRef(
        debounce(
          () => {
            hover.current = false;
            setHovering(false);
          },
          50,
          { leading: true }
        )
      );

      return (
        <div
          ref={mergeRefs(ref, container)}
          className={cn('flex flex-col break-words', {
            'pt-3': newAuthor,
            'pb-2': isLast,
          })}
          onMouseEnter={onOver}
          onClick={onOver}
          onMouseLeave={onOut.current}
        >
          {unread && briefMatches(unread.brief, writ.seal.id) ? (
            <DateDivider
              date={unix}
              unreadCount={unread.brief.count}
              ref={viewRef}
            />
          ) : null}
          {newDay ? <DateDivider date={unix} /> : null}
          {newAuthor ? <Author ship={memo.author} date={unix} /> : null}
          <div className="group-one relative z-0 flex w-full">
            {hideOptions || (isScrolling && !hovering) || !hovering ? null : (
              <ChatMessageOptions
                hideThreadReply={hideReplies}
                whom={whom}
                writ={writ}
                hideReply={whomIsDm(whom) || whomIsMultiDm(whom) || hideReplies}
              />
            )}
            <div className="-ml-1 mr-1 py-2 text-xs font-semibold text-gray-400 opacity-0 group-one-hover:opacity-100">
              {format(unix, 'HH:mm')}
            </div>
            <div className="wrap-anywhere flex w-full">
              <div
                className={cn(
                  'flex w-full grow flex-col space-y-2 rounded py-1 pl-3 pr-2 group-one-hover:bg-gray-50',
                  isReplyOp && 'bg-gray-50',
                  !isMessageDelivered && !isMessagePosted && 'text-gray-400',
                  isLinked && 'bg-blue-softer'
                )}
              >
                {'story' in memo.content ? (
                  <ChatContent
                    story={memo.content.story}
                    isScrolling={isScrolling}
                    writId={seal.id}
                  />
                ) : null}
                {Object.keys(seal.feels).length > 0 && (
                  <ChatReactions seal={seal} whom={whom} />
                )}
                {numReplies > 0 && !hideReplies ? (
                  <NavLink
                    to={`message/${seal.id}`}
                    className={({ isActive }) =>
                      cn(
                        'group -ml-2 whitespace-nowrap rounded p-2 text-sm font-semibold text-gray-800',
                        isActive
                          ? 'is-active bg-gray-50 [&>div>div>.reply-avatar]:outline-gray-50'
                          : '',
                        isLinked
                          ? '[&>div>div>.reply-avatar]:outline-blue-100 dark:[&>div>div>.reply-avatar]:outline-blue-900'
                          : ''
                      )
                    }
                  >
                    <div className="flex items-center">
                      <div className="mr-2 flex flex-row-reverse">
                        {replyAuthors.map((ship, i) => (
                          <div
                            key={ship}
                            className={cn(
                              'reply-avatar relative h-6 w-6 rounded bg-white outline outline-2 outline-white group-one-focus-within:outline-gray-50 group-one-hover:outline-gray-50',
                              i !== 0 && '-mr-3'
                            )}
                          >
                            <Avatar key={ship} ship={ship} size="xs" />
                          </div>
                        ))}
                      </div>

                      <span
                        className={cn(
                          repliesContainsUnreadId ? 'text-blue' : 'mr-2'
                        )}
                      >
                        {numReplies} {numReplies > 1 ? 'replies' : 'reply'}{' '}
                      </span>
                      {repliesContainsUnreadId ? (
                        <UnreadIndicator
                          className="h-6 w-6 text-blue transition-opacity"
                          aria-label="Unread replies in this thread"
                        />
                      ) : null}
                      <span className="text-gray-400">
                        <span className="hidden sm:inline-block">
                          Last reply&nbsp;
                        </span>
                        <span className="inline-block first-letter:capitalize sm:first-letter:normal-case">
                          {isToday(lastReplyTime)
                            ? `${formatDistanceToNow(lastReplyTime)} ago`
                            : formatRelative(lastReplyTime, new Date())}
                        </span>
                      </span>
                    </div>
                  </NavLink>
                ) : null}
              </div>
              <div className="relative flex w-5 items-end rounded-r group-one-hover:bg-gray-50">
                {!isMessageDelivered && (
                  <DoubleCaretRightIcon
                    className="absolute left-0 bottom-2 h-5 w-5"
                    primary={isMessagePosted ? 'text-black' : 'text-gray-200'}
                    secondary="text-gray-200"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  )
);

export default ChatMessage;

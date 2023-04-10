import React, { useEffect } from 'react';
import Picker from '@emoji-mart/react';
import * as Popover from '@radix-ui/react-popover';
import useEmoji from '@/state/emoji';
import { useIsMobile } from '@/logic/useMedia';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

interface EmojiPickerProps extends Record<string, any> {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactChild;
  withTrigger?: boolean;
}

export default function EmojiPicker({
  open,
  setOpen,
  children,
  withTrigger = true,
  ...props
}: EmojiPickerProps) {
  const { data, load } = useEmoji();
  const isMobile = useIsMobile();
  const width = window.innerWidth;
  const mobilePerLineCount = Math.floor((width - 10) / 36);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      {withTrigger ? (
        <Popover.Trigger asChild>{children}</Popover.Trigger>
      ) : (
        children
      )}
      {(isMobile || !withTrigger) && (
        <Popover.Anchor className={isMobile ? 'fixed inset-x-0 top-12' : ''} />
      )}
      <Popover.Portal>
        <Popover.Content side="bottom" sideOffset={30} collisionPadding={15}>
          <div className="z-50 mx-10 flex h-96 w-72 items-center justify-center">
            {data ? (
              <Picker
                data={data}
                autoFocus={isMobile}
                perLine={isMobile ? mobilePerLineCount : 9}
                previewPosition="none"
                {...props}
              />
            ) : (
              <div className="flex h-96 w-72 items-center justify-center">
                <LoadingSpinner className="h-6 w-6" />
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

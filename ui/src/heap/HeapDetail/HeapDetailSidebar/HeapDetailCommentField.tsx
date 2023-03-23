import React, { useState } from 'react';
import { useParams } from 'react-router';
import { JSONContent } from '@tiptap/core';
import HeapTextInput from '@/heap/HeapTextInput';
import useNest from '@/logic/useNest';
import { nestToFlag } from '@/logic/utils';
import { decToUd } from '@urbit/api';

export default function HeapDetailCommentField() {
  const nest = useNest();
  const { idCurio } = useParams();
  const [, chFlag] = nestToFlag(nest);
  const [draftText, setDraftText] = useState<JSONContent>();
  const replyToTime = idCurio ? decToUd(idCurio) : undefined;

  return (
    <div className="px-2 lg:absolute lg:bottom-0 lg:w-full">
      <HeapTextInput
        flag={chFlag}
        draft={draftText}
        setDraft={setDraftText}
        replyTo={replyToTime}
        placeholder="Comment"
        comment={true}
      />
    </div>
  );
}

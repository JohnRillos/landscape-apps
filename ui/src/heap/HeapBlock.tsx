import React, { Suspense } from 'react';
import { HeapCurio } from '@/types/heap';
import {
  AUDIO_REGEX,
  IMAGE_REGEX,
  isValidUrl,
  validOembedCheck,
} from '@/logic/utils';
import { useEmbed } from '@/logic/embed';
import HeapContent from './HeapContent';

export default function HeapBlock({ curio }: { curio: HeapCurio }) {
  const { content } = curio.heart;
  const url = content[0].toString();

  const isImage = IMAGE_REGEX.test(url);
  const isAudio = AUDIO_REGEX.test(url);
  const isText = !isValidUrl(url);
  const oembed = useEmbed(url);
  const isOembed = validOembedCheck(oembed, url);

  if (isText) {
    return (
      <div className="heap-block px-2 py-1">
        <HeapContent content={content} />
      </div>
    );
  }

  if (isImage) {
    return (
      <div
        className="heap-block"
        style={{
          backgroundImage: `url(${content[0]})`,
        }}
      />
    );
  }

  if (isOembed) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="heap-block">
          <div className="oembed">
            <div
              className="oembed-content"
              dangerouslySetInnerHTML={{ __html: oembed.read().html }}
            />
          </div>
        </div>
      </Suspense>
    );
  }

  return <div className="heap-block">{content[0]}</div>;
}

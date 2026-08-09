'use client';

import { useEffect, useState } from 'react';
import type { AttachmentItem } from '@/features/attachments/hooks/useAttachments';
import { attachmentsApi } from '@/features/attachments/services/attachmentsApi';
import { formatDateTime, formatFileSize } from '@/lib/formatDate';
import { cn } from '@/lib/cn';

type Props = {
  attachments: AttachmentItem[];
  canUpload: boolean;
  uploading?: boolean;
  inputKey?: number;
  onUpload: (file: File) => Promise<void>;
};

function AttachmentThumb({ item }: { item: AttachmentItem }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    if (!item.mimeType.startsWith('image/')) return;
    let url: string | null = null;
    void attachmentsApi.previewUrl(item.id).then((u) => {
      url = u;
      setSrc(u);
    });
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [item.id, item.mimeType]);

  if (src) {
    return <img src={src} alt={item.originalName} className="h-14 w-14 rounded object-cover" />;
  }
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded bg-slate-200 text-2xl">📄</div>
  );
}

export function AttachmentList({ attachments, canUpload, uploading, inputKey = 0, onUpload }: Props) {
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) await onUpload(file);
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-display text-lg font-semibold">Attachments</h2>
      <ul className="mt-3 space-y-3">
        {attachments.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3"
          >
            <AttachmentThumb item={a} />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                className="truncate text-left text-sm font-medium text-teal-700 hover:underline"
                onClick={() => void attachmentsApi.download(a.id, a.originalName)}
              >
                {a.originalName}
              </button>
              <p className="text-xs text-slate-500">
                {formatFileSize(a.size)} · {formatDateTime(a.createdAt)}
              </p>
            </div>
          </li>
        ))}
        {!attachments.length && <li className="text-sm text-slate-500">No files attached yet.</li>}
      </ul>
      {canUpload && (
        <div
          className={cn(
            'mt-4 rounded-lg border-2 border-dashed p-6 text-center transition',
            dragOver ? 'border-teal-400 bg-teal-50' : 'border-slate-200'
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
        >
          <p className="text-sm text-slate-600">Drag & drop a file here, or</p>
          <label className="mt-2 inline-block cursor-pointer">
            <span className="text-teal-700 hover:underline">Choose file</span>
            <input
              key={inputKey}
              type="file"
              className="hidden"
              disabled={uploading}
              onChange={(e) => void handleFiles(e.target.files)}
            />
          </label>
          {uploading && <p className="mt-2 text-xs text-slate-500">Uploading…</p>}
        </div>
      )}
    </section>
  );
}

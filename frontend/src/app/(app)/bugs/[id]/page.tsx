'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useBugDetail } from '@/features/bugs/hooks/useBugs';
import { useBugStatus } from '@/features/bugs/hooks/useBugStatus';
import { useComments } from '@/features/comments/hooks/useComments';
import { useAttachments } from '@/features/attachments/hooks/useAttachments';
import {
  BugDetailHeader,
  BugDetailsPanel,
  BugStatusForm,
  BugTimeline,
} from '@/features/bugs/components/BugDetailPanels';
import { BugEditForm } from '@/features/bugs/components/BugEditForm';
import { BugAssignForm } from '@/features/bugs/components/BugAssignForm';
import { CommentList } from '@/features/comments/components/CommentList';
import { AttachmentList } from '@/features/attachments/components/AttachmentList';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Form';
import { useAuth } from '@/providers/AuthProvider';
import { priorityClass, severityClass } from '@/lib/statusStyles';
import type { BugStatus } from '@/types';

export default function BugDetailPage() {
  const params = useParams<{ id: string }>();
  const { bug, timeline, loading, error, reload } = useBugDetail(params.id);
  const { comments, submitting, addComment } = useComments(params.id);
  const { attachments, uploading, upload, inputKey } = useAttachments(params.id, () => void reload());
  const { status, setStatus, saving, save } = useBugStatus(params.id, bug?.status);
  const { user } = useAuth();
  const [commentBody, setCommentBody] = useState('');
  const [tab, setTab] = useState('details');
  const canWrite = !!user?.permissions?.includes('comment:create');
  const canUpload = !!user?.permissions?.includes('attachment:upload');
  const canStatus = !!user?.permissions?.includes('bug:status');
  const canUpdate = !!user?.permissions?.includes('bug:update');
  const canAssign = !!user?.permissions?.includes('bug:assign');

  if (loading) return <p className="text-slate-500">Loading bug...</p>;
  if (error || !bug) return <p className="text-red-600">{error || 'Bug not found'}</p>;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'comments', label: 'Comments', count: comments.length },
    { id: 'attachments', label: 'Attachments', count: attachments.length },
    { id: 'history', label: 'History' },
  ];

  return (
    <div className="space-y-6">
      <BugDetailHeader bug={bug} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Tabs tabs={tabs} active={tab} onChange={setTab} />
          {tab === 'details' && (
            <>
              <BugDetailsPanel bug={bug} />
              {canUpdate && <BugEditForm bug={bug} onSaved={reload} />}
            </>
          )}
          {tab === 'comments' && (
            <CommentList
              comments={comments}
              canWrite={canWrite}
              body={commentBody}
              onBodyChange={setCommentBody}
              submitting={submitting}
              onSubmit={async (e) => {
                e.preventDefault();
                await addComment(commentBody);
                setCommentBody('');
                await reload();
              }}
            />
          )}
          {tab === 'attachments' && (
            <AttachmentList
              attachments={attachments}
              canUpload={canUpload}
              uploading={uploading}
              inputKey={inputKey}
              onUpload={upload}
            />
          )}
          {tab === 'history' && (
            <BugTimeline events={timeline as Parameters<typeof BugTimeline>[0]['events']} />
          )}
        </div>
        <div className="space-y-4">
          {canStatus && (
            <BugStatusForm
              currentStatus={bug.status}
              status={status}
              onStatusChange={(v: BugStatus) => setStatus(v)}
              saving={saving}
              onSubmit={async (e) => {
                e.preventDefault();
                await save();
                await reload();
              }}
            />
          )}
          {canAssign && <BugAssignForm bug={bug} onSaved={reload} />}
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-lg font-semibold">Properties</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Type</dt>
                <dd>{bug.issueType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Severity</dt>
                <dd>
                  <Badge className={severityClass[bug.severity]}>{bug.severity}</Badge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Priority</dt>
                <dd className={priorityClass[bug.priority]}>{bug.priority}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

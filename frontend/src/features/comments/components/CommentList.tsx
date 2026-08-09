import type { CommentItem } from '@/features/comments/hooks/useComments';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Form';
import { formatDateTime } from '@/lib/formatDate';

type Props = {
  comments: CommentItem[];
  canWrite: boolean;
  body: string;
  onBodyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting?: boolean;
};

export function CommentList({ comments, canWrite, body, onBodyChange, onSubmit, submitting }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-display text-lg font-semibold">Comments</h2>
      <ul className="mt-3 space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="rounded-md bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-900">{c.author?.name}</p>
            <p className="text-xs text-slate-400">{formatDateTime(c.createdAt)}</p>
            <p className="mt-1 text-slate-700">{c.body}</p>
          </li>
        ))}
      </ul>
      {canWrite && (
        <form onSubmit={onSubmit} className="mt-4 space-y-2">
          <Textarea value={body} onChange={(e) => onBodyChange(e.target.value)} rows={3} required />
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Add comment'}
          </Button>
        </form>
      )}
    </section>
  );
}

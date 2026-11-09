export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md overflow-hidden rounded-2xl border border-foreground/10 bg-surface shadow-2xl shadow-black/20 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Content */}
        <div className="p-6 sm:p-7">
          {/* Icon */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
              destructive
                ? "bg-error/10 text-error"
                : "bg-primary/10 text-primary"
            }`}
          >
            {destructive ? "⚠️" : "🌿"}
          </div>

          {/* Heading */}
          <h2
            id="confirm-dialog-title"
            className="mt-5 text-xl font-bold tracking-tight text-foreground"
          >
            {title}
          </h2>

          {/* Message */}
          <p className="mt-2 text-sm leading-relaxed text-foreground/60">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-foreground/10 bg-foreground/[0.02] px-6 py-4 sm:flex-row sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-foreground/15 bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              destructive
                ? "bg-error focus:ring-error/40"
                : "bg-primary focus:ring-primary/40"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

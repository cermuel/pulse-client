type DeletePulseModalProps = {
  pulse: {
    name: string;
    publicId: string;
  };
  confirmationValue: string;
  onConfirmationChange: (value: string) => void;
  canDelete: boolean;
  isDeleting: boolean;
  errorMessage?: string;
  onClose: () => void;
  onDelete: () => void;
};

export function DeletePulseModal({
  pulse,
  confirmationValue,
  onConfirmationChange,
  canDelete,
  isDeleting,
  errorMessage,
  onClose,
  onDelete,
}: DeletePulseModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md border border-[rgba(245,245,245,0.08)] bg-[#111] p-5 sm:p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#fb923c]">
          Delete pulse
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-[#f5f5f5]">
          This action is permanent
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#7a7a7a]">
          Type <span className="text-[#f5f5f5]">{pulse.name || pulse.publicId}</span>{" "}
          or <span className="text-[#f5f5f5]">{pulse.publicId}</span> to confirm
          deletion.
        </p>

        <input
          type="text"
          value={confirmationValue}
          onChange={(event) => onConfirmationChange(event.target.value)}
          placeholder={pulse.name || pulse.publicId}
          className="mt-6 w-full border border-[rgba(245,245,245,0.14)] bg-[#161616] px-4 py-3 font-mono text-[12px] text-[#f5f5f5] outline-none transition-colors focus:border-[#fb923c]"
        />

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-400">
            {Array.isArray(errorMessage)
              ? errorMessage.join(", ")
              : errorMessage}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex cursor-pointer items-center justify-center border border-[rgba(245,245,245,0.14)] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[#f5f5f5] transition-colors hover:border-[#fb923c] hover:text-[#fb923c]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete || isDeleting}
            className="inline-flex cursor-pointer items-center justify-center border border-red-500/30 bg-red-500/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-red-400 transition-colors hover:border-red-500/50 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDeleting ? "Deleting..." : "Delete pulse"}
          </button>
        </div>
      </div>
    </div>
  );
}

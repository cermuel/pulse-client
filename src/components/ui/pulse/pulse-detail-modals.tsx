import { DeletePulseModal } from "#/components/ui/pulse/delete-pulse-modal";
import { EditPulseModal } from "#/components/ui/pulse/edit-pulse-modal";
import type { PulseDetail, PulseDetailUiState } from "#/types/routes/pulse-detail";

type PulseDetailModalsProps = {
  pulse: PulseDetail;
  uiState: PulseDetailUiState;
  isFreePlan: boolean;
  canDelete: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  deleteErrorMessage?: string;
  onFormChange: (
    updater:
      | PulseDetailUiState["editForm"]
      | ((form: PulseDetailUiState["editForm"]) => PulseDetailUiState["editForm"]),
  ) => void;
  onCloseEdit: () => void;
  onSaveEdit: () => void;
  onDeleteValueChange: (value: string) => void;
  onCloseDelete: () => void;
  onDelete: () => void;
};

export function PulseDetailModals({
  pulse,
  uiState,
  isFreePlan,
  canDelete,
  isSaving,
  isDeleting,
  deleteErrorMessage,
  onFormChange,
  onCloseEdit,
  onSaveEdit,
  onDeleteValueChange,
  onCloseDelete,
  onDelete,
}: PulseDetailModalsProps) {
  return (
    <>
      {uiState.isEditOpen ? (
        <EditPulseModal
          pulse={pulse}
          isFreePlan={isFreePlan}
          form={uiState.editForm}
          errorMessage={uiState.editError}
          isSaving={isSaving}
          onChange={onFormChange}
          onClose={onCloseEdit}
          onSave={onSaveEdit}
        />
      ) : null}

      {uiState.isDeleteModalOpen ? (
        <DeletePulseModal
          pulse={pulse}
          confirmationValue={uiState.deleteValue}
          onConfirmationChange={onDeleteValueChange}
          canDelete={canDelete}
          isDeleting={isDeleting}
          errorMessage={deleteErrorMessage}
          onClose={onCloseDelete}
          onDelete={onDelete}
        />
      ) : null}
    </>
  );
}

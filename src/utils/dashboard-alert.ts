import Swal from 'sweetalert2';

const toastBase = {
  toast: true,
  position: 'bottom-end' as const,
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  backdrop: true,
};

export const showDashboardSuccess = (message: string) =>
  Swal.fire({
    ...toastBase,
    icon: 'success',
    title: message,
  });

export const showDashboardError = (message: string) =>
  Swal.fire({
    ...toastBase,
    icon: 'error',
    title: message,
    timer: 4000,
  });

export const confirmDashboardAction = async ({
  title,
  text,
  confirmButtonText = 'Yes',
  cancelButtonText = 'No',
}: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
  });

  return result.isConfirmed;
};

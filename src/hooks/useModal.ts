export const useModal = () => {
  const vm = getCurrentInstance();
  const $emit: ((event: 'onOpen' | 'onClose' | 'confirm', ...args: any[]) => void) | undefined = vm?.emit;

  const confirmLoading = ref(false);

  const handleOpen = () => {
    $emit?.('onOpen');
  };

  const handleClose = () => {
    $emit?.('onClose');
    confirmLoading.value = false;
  };

  const handleConfirm = () => {
    $emit?.('confirm', confirmLoading);
  };

  return {
    $emit,
    confirmLoading,
    handleOpen,
    handleClose,
    handleConfirm
  };
};

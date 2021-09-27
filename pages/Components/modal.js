import { Stack, Modal } from "@shopify/polaris";

const ModalComponent = (props) => {
  const {
    isModal,
    toggleActive,
    handleLogin,
    from,
    large,
    HeaderTag,
    children,
    isLoading,
  } = props;
  return (
    <Modal
      large={large}
      open={isModal}
      onClose={toggleActive}
      title={HeaderTag}
      primaryAction={{
        content: from === "Dashboard" ? "Uninstall" : "Login",
        onAction: handleLogin,
        loading: isLoading,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: toggleActive,
        },
      ]}
    >
      <Modal.Section>
        <Stack vertical>{children}</Stack>
      </Modal.Section>
    </Modal>
  );
};

export default ModalComponent;

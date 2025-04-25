export type ListItem = {
  id: string;
  name: string;
  isDone: boolean;
};

export type ModalProps = {
  handleModalClose: () => void;
};

export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;

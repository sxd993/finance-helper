import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/providers";
import { openModal, closeModal, toggleModal } from "./modal.slice";

export const useModal = (id: string) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.modal[id] || false);

    const open = () => dispatch(openModal(id));
    const close = () => dispatch(closeModal(id));
    const toggle = () => dispatch(toggleModal(id));

    return { isOpen, open, close, toggle };
};

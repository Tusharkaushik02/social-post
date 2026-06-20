import Modal from '@/components/ui/Modal';
import CommentSection from '@/components/post/CommentSection';

export default function CommentModal({ post, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Comments" size="lg" className="comment-modal" contentClassName="comment-modal-content">
      <CommentSection post={post} />
    </Modal>
  );
}

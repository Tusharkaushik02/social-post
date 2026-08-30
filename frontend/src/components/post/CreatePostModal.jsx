import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  IoCloseOutline,
  IoImageOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoStatsChartOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { MAX_CAPTION_LENGTH } from '@/config/constants';
import { usePostStore } from '@/stores/usePostStore';

const createPostSchema = z.object({
  caption: z
    .string()
    .trim()
    .min(1, 'Caption is required')
    .max(MAX_CAPTION_LENGTH, `Caption must be ${MAX_CAPTION_LENGTH} characters or fewer`),
});

export default function CreatePostModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const createPost = usePostStore((s) => s.createPost);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPostSchema),
    defaultValues: { caption: '' },
  });

  const caption = useWatch({ control, name: 'caption' });
  const remaining = MAX_CAPTION_LENGTH - (caption?.length || 0);
  const progress = Math.min((caption?.length || 0) / MAX_CAPTION_LENGTH, 1);

  const resetForm = useCallback(() => {
    reset();
    setImageFile(null);
    setImagePreview('');
    setImageError('');
    setIsDragging(false);
    setIsSubmitting(false);
  }, [reset]);

  const validateFile = useCallback((file) => {
    if (!file) return '';
    if (!file.type.startsWith('image/')) return 'Upload an image file.';
    if (file.size > 10 * 1024 * 1024) return 'Image must be 10MB or smaller.';
    return '';
  }, []);

  const handleFile = useCallback((file) => {
    const message = validateFile(file);
    if (message) {
      setImageError(message);
      return;
    }

    setImageError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }, [validateFile]);

  const dropHandlers = useMemo(
    () => ({
      onDragOver: (event) => {
        event.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: () => setIsDragging(false),
      onDrop: (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files?.[0]);
      },
    }),
    [handleFile]
  );

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  const onSubmit = async (values) => {
    if (!imageFile) {
      setImageError('Add an image before publishing.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({ caption: values.caption.trim(), imageFile, imagePreview });
      toast.success('Post created');
      handleClose();
    } catch {
      toast.error('Could not create post');
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || !caption?.trim() || remaining < 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <form onSubmit={handleSubmit(onSubmit)} style={{ position: 'relative', display: 'flex', flexDirection: 'column', maxHeight: '85vh', width: '100%' }} noValidate>
        {/* Header */}
        <header className="create-post-header">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cancel"
            className="modal-close-btn"
          >
            <IoCloseOutline size={20} />
          </button>
          <h1 className="create-post-title">New Post</h1>
          <button
            type="submit"
            disabled={isDisabled}
            className={`create-post-submit ${isDisabled ? 'disabled' : 'enabled'}`}
          >
            {isSubmitting ? 'Posting…' : 'Post'}
          </button>
        </header>

        {/* Content Body */}
        <div className="create-post-body">
          {/* User Info & Text Area */}
          <div className="create-post-caption-row">
            <Avatar
              src={user?.avatar}
              fallbackName={user?.displayName || user?.username}
              alt="My Avatar"
              size="md"
              style={{ flexShrink: 0 }}
            />
            <div className="create-post-caption-field">
              <textarea
                id="postContent"
                aria-label="Post caption"
                className="create-post-textarea"
                placeholder="What's on your mind?"
                rows={3}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.caption)}
                aria-describedby={errors.caption ? 'post-caption-error' : undefined}
                {...register('caption')}
              />
              {errors.caption && (
                <p id="post-caption-error" className="input-error" role="alert">
                  {errors.caption.message}
                </p>
              )}
            </div>
          </div>

          {/* Drag & Drop File Input Area */}
          <div className="create-post-media">
            {imagePreview ? (
              <div style={{ position: 'relative', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '0.5px solid rgba(207, 196, 197, 0.3)' }}>
                <img
                  src={imagePreview}
                  alt="Post preview"
                  style={{ maxHeight: '320px', width: '100%', objectFit: 'contain', background: 'var(--color-surface-container-low)' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    style={{
                      display: 'flex',
                      height: '40px',
                      width: '40px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(0, 0, 0, 0.6)',
                      color: '#ffffff',
                      backdropFilter: 'blur(4px)',
                      transition: 'background 0.2s',
                    }}
                    aria-label="Remove image"
                    onMouseEnter={(e) => e.currentTarget.parentElement.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.parentElement.style.opacity = '0'}
                  >
                    <IoTrashOutline size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...dropHandlers}
                className={`drop-zone${isDragging ? ' dragging' : ''}`}
              >
                <input
                  type="file"
                  accept="image/*"
                  aria-label="Upload image"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <div className="drop-zone-icon">
                  <IoImageOutline size={22} />
                </div>
                <div style={{ textAlign: 'center', padding: '0 16px' }}>
                  <p className="text-label-lg" style={{ color: 'var(--color-on-surface)' }}>Click or drag image here</p>
                  <p className="text-label-sm" style={{ color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>High-res images up to 10 MB</p>
                </div>
              </div>
            )}
            {imageError && (
              <p className="input-error" style={{ marginTop: '8px' }}>{imageError}</p>
            )}
          </div>

          {/* Tools & Counters Footer */}
          <div className="create-post-tools">
            <div style={{ display: 'flex', gap: '2px' }}>
              {[
                { icon: IoLocationOutline, label: 'Add location' },
                { icon: IoPeopleOutline, label: 'Tag people' },
                { icon: IoStatsChartOutline, label: 'Add poll' },
              ].map((tool) => (
                <button
                  key={tool.label}
                  type="button"
                  className="create-post-tool-btn"
                  aria-label={tool.label}
                >
                  <tool.icon size={18} />
                </button>
              ))}
            </div>

            {/* Character Counter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                className="text-label-sm"
                style={{ color: remaining < 0 ? 'var(--color-error)' : 'var(--color-on-surface-variant)', transition: 'color 0.2s' }}
              >
                {caption?.length || 0}/{MAX_CAPTION_LENGTH}
              </span>
              <div style={{ position: 'relative', height: '20px', width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg style={{ transform: 'rotate(-90deg)', height: '20px', width: '20px' }} viewBox="0 0 20 20">
                  <circle
                    style={{ color: 'var(--color-surface-container-high)' }}
                    cx="10" cy="10" fill="transparent" r="8"
                    stroke="currentColor" strokeWidth="2"
                  />
                  <circle
                    style={{
                      color: remaining < 0 ? 'var(--color-error)' : remaining < 28 ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
                      transition: 'all 0.2s ease-out',
                    }}
                    cx="10" cy="10" fill="transparent" r="8"
                    stroke="currentColor" strokeWidth="2"
                    strokeDasharray="50.27"
                    strokeDashoffset={Math.max(0, 50.27 - progress * 50.27)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
}

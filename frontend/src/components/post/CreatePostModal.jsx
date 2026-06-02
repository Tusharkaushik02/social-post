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
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col max-h-[85vh] w-full" noValidate>
        {/* Header */}
        <header className="flex justify-between items-center px-4 py-2.5 border-b-[0.5px] border-outline-variant/30 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cancel"
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-low active:scale-95 flex items-center justify-center"
          >
            <IoCloseOutline size={20} />
          </button>
          <h1 className="font-headline-md text-headline-md text-primary">New Post</h1>
          <button
            type="submit"
            disabled={isSubmitting || !caption?.trim() || remaining < 0}
            className={cn(
              "font-label-md text-label-md px-4 py-1.5 rounded-full transition-all duration-200",
              (!caption?.trim() || remaining < 0 || isSubmitting)
                ? "text-primary/50 bg-surface-container-high cursor-not-allowed"
                : "bg-primary text-on-primary hover:opacity-90 active:scale-95 shadow-sm"
            )}
          >
            Post
          </button>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[280px]">
          {/* User Info & Text Area */}
          <div className="flex gap-3 items-start">
            <Avatar
              src={user?.avatar}
              fallbackName={user?.displayName || user?.username}
              alt="My Avatar"
              size="md"
              className="shrink-0"
            />
            <div className="flex-1 flex flex-col min-h-[100px]">
              <textarea
                id="postContent"
                className="w-full bg-transparent border-none focus:ring-0 resize-none font-body-lg text-body-lg text-on-surface placeholder:text-on-surface-variant/50 p-0 m-0 pt-1 outline-none"
                placeholder="What's on your mind?"
                rows={3}
                {...register('caption')}
              />
            </div>
          </div>

          {/* Drag & Drop File Input Area */}
          <div className="ml-12 mb-2">
            {imagePreview ? (
              <div className="relative w-full rounded-lg overflow-hidden border border-outline-variant/30 group">
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="max-h-[320px] w-full object-contain bg-black/10 dark:bg-black/30"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview('');
                    }}
                    className="p-2.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                    aria-label="Remove image"
                  >
                    <IoTrashOutline size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div
                {...dropHandlers}
                className={cn(
                  "border-2 border-dashed rounded-lg hover:bg-surface-container-low transition-colors duration-200 cursor-pointer flex flex-col items-center justify-center py-6 gap-2 group relative overflow-hidden",
                  isDragging
                    ? "border-primary bg-surface-container-low"
                    : "border-outline-variant/50 bg-surface-container-lowest"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                />
                <div className="w-10 h-10 rounded-full bg-surface-container-high group-hover:bg-primary-container flex items-center justify-center transition-colors duration-200 text-on-surface-variant group-hover:text-primary">
                  <IoImageOutline size={22} />
                </div>
                <div className="text-center px-4">
                  <p className="font-label-md text-label-md text-primary">Click or drag image here</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">High-res images up to 10MB</p>
                </div>
              </div>
            )}
            {imageError && <p className="text-label-sm text-error mt-2">{imageError}</p>}
          </div>

          {/* Tools & Counters Footer */}
          <div className="ml-12 flex justify-between items-center pt-3 border-t-[0.5px] border-outline-variant/30 mt-auto shrink-0">
            <div className="flex gap-2">
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center"
                aria-label="Add location"
              >
                <IoLocationOutline size={18} />
              </button>
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center"
                aria-label="Tag people"
              >
                <IoPeopleOutline size={18} />
              </button>
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center"
                aria-label="Add poll"
              >
                <IoStatsChartOutline size={18} />
              </button>
            </div>

            {/* Character Counter Progress Circle */}
            <div className="flex items-center gap-3">
              <span className={cn("font-label-sm text-label-sm transition-colors", remaining < 0 ? "text-error" : "text-on-surface-variant")}>
                {caption?.length || 0}/{MAX_CAPTION_LENGTH}
              </span>
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg className="transform -rotate-90 w-6 h-6" viewBox="0 0 24 24">
                  <circle className="text-surface-container-highest stroke-current" cx="12" cy="12" fill="transparent" r="10" strokeWidth="2" />
                  <circle
                    className={cn(
                      "stroke-current transition-all duration-200 ease-out",
                      remaining < 0 ? "text-error" : remaining < 28 ? "text-secondary" : "text-primary"
                    )}
                    cx="12"
                    cy="12"
                    fill="transparent"
                    r="10"
                    strokeWidth="2"
                    strokeDasharray="62.83"
                    strokeDashoffset={Math.max(0, 62.83 - (Math.min(caption?.length || 0, MAX_CAPTION_LENGTH) / MAX_CAPTION_LENGTH) * 62.83)}
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

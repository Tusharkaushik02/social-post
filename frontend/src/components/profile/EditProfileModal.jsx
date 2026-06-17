import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { usersApi } from '@/api/users.api';
import { useAuthStore } from '@/stores/useAuthStore';

export default function EditProfileModal({ isOpen, onClose, profile, onProfileUpdated }) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Sync form fields when modal opens or profile changes
  useEffect(() => {
    if (isOpen && profile) {
      setDisplayName(profile.displayName || profile.displayname || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar || profile.avatarUrl || '');
    }
  }, [isOpen, profile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const { data } = await usersApi.updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: avatarUrl.trim(),
      });

      // Update the auth store's user with new data
      const updatedUser = data.user || data;
      useAuthStore.setState((state) => ({
        user: {
          ...state.user,
          displayName: updatedUser.displayname || updatedUser.displayName || displayName.trim(),
          displayname: updatedUser.displayname || displayName.trim(),
          bio: updatedUser.bio || bio.trim(),
          avatar: updatedUser.avatarUrl || avatarUrl.trim(),
          avatarUrl: updatedUser.avatarUrl || avatarUrl.trim(),
        },
      }));

      toast.success('Profile updated');
      onProfileUpdated?.({
        displayName: updatedUser.displayname || displayName.trim(),
        bio: updatedUser.bio || bio.trim(),
        avatar: updatedUser.avatarUrl || avatarUrl.trim(),
        avatarUrl: updatedUser.avatarUrl || avatarUrl.trim(),
      });
      onClose();
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Failed to update profile';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="sm">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Display Name */}
        <div className="edit-profile-field">
          <label
            htmlFor="edit-displayName"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-on-surface-variant)',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            Display Name
          </label>
          <input
            id="edit-displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            maxLength={50}
            className="edit-profile-input"
          />
        </div>

        {/* Bio */}
        <div className="edit-profile-field">
          <label
            htmlFor="edit-bio"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-on-surface-variant)',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            Bio
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell people about yourself"
            maxLength={160}
            rows={3}
            className="edit-profile-input"
            style={{ resize: 'vertical', minHeight: '72px' }}
          />
          <span style={{
            fontSize: '12px',
            color: 'var(--color-outline)',
            marginTop: '4px',
            display: 'block',
            textAlign: 'right',
          }}>
            {bio.length}/160
          </span>
        </div>

        {/* Avatar URL */}
        <div className="edit-profile-field">
          <label
            htmlFor="edit-avatar"
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-on-surface-variant)',
              marginBottom: '6px',
              display: 'block',
            }}
          >
            Avatar URL
          </label>
          <input
            id="edit-avatar"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/avatar.jpg"
            className="edit-profile-input"
          />
          {avatarUrl && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={avatarUrl}
                alt="Avatar preview"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid var(--color-outline-variant)',
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Preview</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

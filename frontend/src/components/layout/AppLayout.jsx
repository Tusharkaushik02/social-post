import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileTabBar from './MobileTabBar';
import AuthModal from '@/components/auth/AuthModal';
import CreatePostModal from '@/components/post/CreatePostModal';
import { useUIStore } from '@/stores/useUIStore';

export default function AppLayout() {
  const isCreatePostModalOpen = useUIStore((s) => s.createPostModal.isOpen);
  const closeCreatePostModal = useUIStore((s) => s.closeCreatePostModal);

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl gap-8 px-margin-mobile md:px-margin-desktop pb-24 pt-24 justify-center">
        <Sidebar />
        <div className="min-w-0 flex-1 max-w-[640px]">
          <Outlet />
        </div>
        <RightSidebar />
      </main>

      <MobileTabBar />
      <AuthModal />
      <CreatePostModal isOpen={isCreatePostModalOpen} onClose={closeCreatePostModal} />
    </div>
  );
}

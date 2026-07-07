import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileTabBar from './MobileTabBar';
import AuthModal from '@/components/auth/AuthModal';
import CreatePostModal from '@/components/post/CreatePostModal';
import { useUIStore } from '@/stores/useUIStore';
import { useSocket } from '@/hooks/useSocket';

export default function AppLayout() {
  const isCreatePostModalOpen = useUIStore((s) => s.createPostModal.isOpen);
  const closeCreatePostModal = useUIStore((s) => s.closeCreatePostModal);
  
  useSocket(); // Initialize socket when app layout loads

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <Sidebar />
        <div className="app-content">
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

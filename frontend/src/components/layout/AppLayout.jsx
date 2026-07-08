import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import MobileTabBar from './MobileTabBar';
import AuthModal from '@/components/auth/AuthModal';
import CreatePostModal from '@/components/post/CreatePostModal';
import { useUIStore } from '@/stores/useUIStore';
import { useSocket } from '@/hooks/useSocket';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function AppLayout() {
  const isCreatePostModalOpen = useUIStore((s) => s.createPostModal.isOpen);
  const closeCreatePostModal = useUIStore((s) => s.closeCreatePostModal);
  
  useSocket(); // Initialize socket when app layout loads

  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isMobileChatRoute = !isDesktop && location.pathname.match(/^\/messages\/[^/]+$/);

  if (isMobileChatRoute) {
    return (
      <div className="app-layout mobile-chat-fullscreen">
        <Outlet />
      </div>
    );
  }

  const isMessagesRoute = location.pathname.startsWith('/messages');

  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-main">
        <Sidebar />
        <div className={`app-content ${isMessagesRoute ? 'chat-expanded' : ''}`}>
          <Outlet />
        </div>
        {!isMessagesRoute && <RightSidebar />}
      </main>

      <MobileTabBar />

      <AuthModal />
      <CreatePostModal isOpen={isCreatePostModalOpen} onClose={closeCreatePostModal} />
    </div>
  );
}

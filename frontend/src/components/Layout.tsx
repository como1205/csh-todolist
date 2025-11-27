import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';
import MobileBottomNav from './MobileBottomNav';

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Navigation className="hidden lg:block w-64" />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileBottomNav className="lg:hidden" />
    </div>
  );
}

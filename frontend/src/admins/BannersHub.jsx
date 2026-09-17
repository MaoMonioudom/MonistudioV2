import { useState } from 'react';
import { FiHome, FiCamera, FiGrid } from 'react-icons/fi';
import Banners from './Banners';
import ContactBanners from './ContactBanners';
import PortfolioBanners from './PortfolioBanners';

const TABS = [
  { key: 'home', label: 'Home', icon: FiHome, Component: Banners },
  { key: 'contact', label: 'Contact', icon: FiCamera, Component: ContactBanners },
  { key: 'portfolio', label: 'Portfolio', icon: FiGrid, Component: PortfolioBanners },
];

const BannersHub = () => {
  const [activeTab, setActiveTab] = useState('home');
  const ActiveComponent = TABS.find((tab) => tab.key === activeTab)?.Component || Banners;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">Banners</h1>
        <p className="text-gray-400">Manage the banners shown on each page, all in one place.</p>
      </div>

      {/* Page tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-700">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === key
                ? 'border-blue-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <ActiveComponent />
    </div>
  );
};

export default BannersHub;

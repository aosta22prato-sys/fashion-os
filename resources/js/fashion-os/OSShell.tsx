import React, { useState } from 'react';
import { FashionOSLayout } from './layout/FashionOSLayout';
import { CollectionHome } from './library/collection/CollectionHome';
import { DesignStudio } from './library/design/DesignStudio';
import { TryOnStudio } from './library/try-on/TryOnStudio';
import { FashionAssistant } from './components/assistant/FashionAssistant';
import { HomePage } from './pages/HomePage';

import { TrendExplorer } from './library/collection/TrendExplorer';

export const OSShell: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <FashionOSLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && <HomePage onTabChange={setActiveTab} />}
      {activeTab === 'try-on' && <TryOnStudio />}
      {activeTab === 'design' && <DesignStudio />}
      {activeTab === 'collection' && <CollectionHome />}
      {activeTab === 'trends' && <TrendExplorer />}
      {activeTab === 'clusters' && <CollectionHome />}
      
      {/* Portals or additional tabs could go here */}
      
      {/* Assistant is handled via Sidebar/RightPanel in the layout, 
          but for simplicity in this turn, I'll update the Layout's right panel to use the actual Assistant component.
      */}
    </FashionOSLayout>
  );
};

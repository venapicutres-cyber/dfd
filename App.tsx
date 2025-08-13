import React, { useState, useEffect } from 'react';
import { ViewType, Client, Project, TeamMember, Transaction, Package, AddOn, TeamProjectPayment, Profile, FinancialPocket, TeamPaymentRecord, Lead, RewardLedgerEntry, User, Card, Asset, ClientFeedback, Contract, RevisionStatus, NavigationAction, Notification, SocialMediaPost, PromoCode, SOP } from './types';
import { MOCK_USERS, HomeIcon, FolderKanbanIcon, UsersIcon, DollarSignIcon, PlusIcon } from './constants';
import { useSupabaseData } from './hooks/useSupabaseData';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Clients from './components/Clients';
import { Projects } from './components/Projects';
import { Freelancers } from './components/Freelancers';
import Finance from './components/Finance';
import Packages from './components/Packages';
import Assets from './components/Assets';
import Settings from './components/Settings';
import { CalendarView } from './components/CalendarView';
import Login from './components/Login';
import PublicBookingForm from './components/PublicBookingForm';
import PublicFeedbackForm from './components/PublicFeedbackForm';
import PublicRevisionForm from './components/PublicRevisionForm';
import PublicLeadForm from './components/PublicLeadForm';
import Header from './components/Header';
import SuggestionForm from './components/SuggestionForm';
import ClientReports from './components/ClientKPI';
import GlobalSearch from './components/GlobalSearch';
import Contracts from './components/Contracts';
import ClientPortal from './components/ClientPortal';
import FreelancerPortal from './components/FreelancerPortal';
import SocialPlanner from './components/SocialPlanner';
import PromoCodes from './components/PromoCodes';
import SOPManagement from './components/SOP';

const AccessDenied: React.FC<{onBackToDashboard: () => void}> = ({ onBackToDashboard }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <h2 className="text-2xl font-bold text-brand-danger mb-2">Akses Ditolak</h2>
        <p className="text-brand-text-secondary mb-6">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <button onClick={onBackToDashboard} className="button-primary">Kembali ke Dashboard</button>
    </div>
);

const BottomNavBar: React.FC<{ activeView: ViewType; handleNavigation: (view: ViewType) => void }> = ({ activeView, handleNavigation }) => {
    const navItems = [
        { view: ViewType.DASHBOARD, label: 'Beranda', icon: HomeIcon },
        { view: ViewType.PROJECTS, label: 'Proyek', icon: FolderKanbanIcon },
        { view: ViewType.CLIENTS, label: 'Klien', icon: UsersIcon },
        { view: ViewType.FINANCE, label: 'Keuangan', icon: DollarSignIcon },
    ];

    return (
        <nav className="bottom-nav xl:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => handleNavigation(item.view)}
                        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${activeView === item.view ? 'text-brand-accent' : 'text-brand-text-secondary'}`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

const FloatingActionButton: React.FC<{ onAddClick: (type: string) => void }> = ({ onAddClick }) => {
    const [isOpen, setIsOpen] = useState(false);

    const actions = [
        { label: 'Transaksi', type: 'transaction', icon: <DollarSignIcon className="w-5 h-5" /> },
        { label: 'Proyek', type: 'project', icon: <FolderKanbanIcon className="w-5 h-5" /> },
        { label: 'Klien', type: 'client', icon: <UsersIcon className="w-5 h-5" /> },
    ];

    return (
        <div className="fixed bottom-20 right-5 z-40 xl:hidden">
             {isOpen && (
                <div className="flex flex-col items-end gap-3 mb-3">
                    {actions.map(action => (
                         <div key={action.type} className="flex items-center gap-2">
                             <span className="text-sm font-semibold bg-brand-surface text-brand-text-primary px-3 py-1.5 rounded-lg shadow-md">{action.label}</span>
                             <button
                                onClick={() => { onAddClick(action.type); setIsOpen(false); }}
                                className="w-12 h-12 rounded-full bg-brand-surface text-brand-text-primary shadow-lg flex items-center justify-center"
                            >
                                {action.icon}
                            </button>
                         </div>
                    ))}
                </div>
            )}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform duration-200 ${isOpen ? 'rotate-45 bg-brand-danger' : 'bg-brand-accent'}`}
            >
                <PlusIcon className="w-8 h-8" />
            </button>
        </div>
    );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>(ViewType.DASHBOARD);
  const [notification, setNotification] = useState<string>('');
  const [initialAction, setInitialAction] = useState<NavigationAction | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [route, setRoute] = useState(window.location.hash);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Use Supabase data hook
  const {
    clients, setClients, clientsOps,
    projects, setProjects, projectsOps,
    teamMembers, setTeamMembers, teamMembersOps,
    transactions, setTransactions, transactionsOps,
    packages, setPackages, packagesOps,
    addOns, setAddOns, addOnsOps,
    cards, setCards, cardsOps,
    pockets, setPockets, pocketsOps,
    leads, setLeads, leadsOps,
    assets, setAssets, assetsOps,
    contracts, setContracts, contractsOps,
    clientFeedback, setClientFeedback, clientFeedbackOps,
    socialMediaPosts, setSocialMediaPosts, socialMediaPostsOps,
    promoCodes, setPromoCodes, promoCodesOps,
    sops, setSops, sopsOps,
    notifications, setNotifications, notificationsOps,
    teamProjectPayments, setTeamProjectPayments, teamProjectPaymentsOps,
    teamPaymentRecords, setTeamPaymentRecords, teamPaymentRecordsOps,
    rewardLedgerEntries, setRewardLedgerEntries, rewardLedgerEntriesOps,
    profile, setProfile, profileOps,
    users, setUsers,
    loading, error
  } = useSupabaseData();
  useEffect(() => {
    const handleHashChange = () => {
        setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize users with mock data (since we don't have auth setup yet)
  const [users, setUsers] = useState<User[]>(() => JSON.parse(JSON.stringify(MOCK_USERS)));

  const showNotification = (message: string, duration: number = 3000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, duration);
  };

  const handleLoginSuccess = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setActiveView(ViewType.DASHBOARD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleMarkAsRead = (notificationId: string) => {
    // Update in database
    notificationsOps.update(notificationId, { isRead: true }).catch(console.error);
    
    // Update local state
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };
  
  const handleMarkAllAsRead = () => {
    // Update all unread notifications in database
    const unreadNotifications = notifications.filter(n => !n.isRead);
    unreadNotifications.forEach(n => {
        notificationsOps.update(n.id, { isRead: true }).catch(console.error);
    });
    
    // Update local state
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNavigation = (view: ViewType, action?: NavigationAction, notificationId?: string) => {
    setActiveView(view);
    setInitialAction(action || null);
    setIsSidebarOpen(false); // Close sidebar on navigation
    setIsSearchOpen(false); // Close search on navigation
    if (notificationId) {
        handleMarkAsRead(notificationId);
    }
  };

  const handleUpdateRevision = (projectId: string, revisionId: string, updatedData: { freelancerNotes: string, driveLink: string, status: RevisionStatus }) => {
    // Update revision in database and local state
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const revision = project.revisions?.find(r => r.id === revisionId);
        if (revision) {
            const updatedRevision = {
                ...revision,
                freelancerNotes: updatedData.freelancerNotes,
                driveLink: updatedData.driveLink,
                status: updatedData.status,
                completedDate: updatedData.status === RevisionStatus.COMPLETED ? new Date().toISOString() : revision.completedDate,
            };
            
            // Update in database via API
            revisionsOps.update(revisionId, updatedRevision).catch(console.error);
            
            // Update local state
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    const updatedRevisions = (p.revisions || []).map(r => 
                        r.id === revisionId ? updatedRevision : r
                    );
                    return { ...p, revisions: updatedRevisions };
                }
                return p;
            }));
        }
    }
    showNotification("Update revisi telah berhasil dikirim.");
  };

    const handleClientConfirmation = (projectId: string, stage: 'editing' | 'printing' | 'delivery') => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            const updates: Partial<Project> = {};
            if (stage === 'editing') updates.isEditingConfirmedByClient = true;
            if (stage === 'printing') updates.isPrintingConfirmedByClient = true;
            if (stage === 'delivery') updates.isDeliveryConfirmedByClient = true;
            
            // Update in database
            projectsOps.update(projectId, updates).catch(console.error);
            
            // Update local state
            setProjects(prev => prev.map(p => 
                p.id === projectId ? { ...p, ...updates } : p
            ));
        }
        showNotification("Konfirmasi telah diterima. Terima kasih!");
    };
    
    const handleClientSubStatusConfirmation = (projectId: string, subStatusName: string, note: string) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            const confirmed = [...(project.confirmedSubStatuses || []), subStatusName];
            const notes = { ...(project.clientSubStatusNotes || {}), [subStatusName]: note };
            const updates = { confirmedSubStatuses: confirmed, clientSubStatusNotes: notes };
            
            // Update in database
            projectsOps.update(projectId, updates).catch(console.error);
            
            // Update local state
            setProjects(prev => prev.map(p => 
                p.id === projectId ? { ...p, ...updates } : p
            ));
    
            const newNotification: Notification = {
                id: `NOTIF-NOTE-${Date.now()}`,
                title: 'Catatan Klien Baru',
                message: `Klien ${project.clientName} memberikan catatan pada sub-status "${subStatusName}" di proyek "${project.projectName}".`,
                timestamp: new Date().toISOString(),
                isRead: false,
                icon: 'comment',
                link: {
                    view: ViewType.PROJECTS,
                    action: { type: 'VIEW_PROJECT_DETAILS', id: projectId }
                }
            };
            
            // Add notification to database and local state
            notificationsOps.create(newNotification).catch(console.error);
            setNotifications(prev => [newNotification, ...prev]);
        }
    
        showNotification(`Konfirmasi untuk "${subStatusName}" telah diterima.`);
    };
    
    const handleSignContract = (contractId: string, signatureDataUrl: string, signer: 'vendor' | 'client') => {
        const updates = signer === 'vendor' 
            ? { vendorSignature: signatureDataUrl } 
            : { clientSignature: signatureDataUrl };
            
        // Update in database
        contractsOps.update(contractId, updates).catch(console.error);
        
        // Update local state
        setContracts(prev => prev.map(c => 
            c.id === contractId ? { ...c, ...updates } : c
        ));
        showNotification('Tanda tangan berhasil disimpan.');
    };
    
    const handleSignInvoice = (projectId: string, signatureDataUrl: string) => {
        const updates = { invoiceSignature: signatureDataUrl };
        
        // Update in database
        projectsOps.update(projectId, updates).catch(console.error);
        
        // Update local state
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates } : p));
        showNotification('Invoice berhasil ditandatangani.');
    };
    
    const handleSignTransaction = (transactionId: string, signatureDataUrl: string) => {
        const updates = { vendorSignature: signatureDataUrl };
        
        // Update in database
        transactionsOps.update(transactionId, updates).catch(console.error);
        
        // Update local state
        setTransactions(prev => prev.map(t => t.id === transactionId ? { ...t, ...updates } : t));
        showNotification('Kuitansi berhasil ditandatangani.');
    };
    
    const handleSignPaymentRecord = (recordId: string, signatureDataUrl: string) => {
        const updates = { vendorSignature: signatureDataUrl };
        
        // Update in database
        teamPaymentRecordsOps.update(recordId, updates).catch(console.error);
        
        // Update local state
        setTeamPaymentRecords(prev => prev.map(r => r.id === recordId ? { ...r, ...updates } : r));
        showNotification('Slip pembayaran berhasil ditandatangani.');
    };


  const hasPermission = (view: ViewType) => {
    if (!currentUser) return false;
    if (currentUser.role === 'Admin') return true;
    if (view === ViewType.DASHBOARD) return true;
    return currentUser.permissions?.includes(view) || false;
  };
  
  const renderView = () => {
    if (!hasPermission(activeView)) {
        return <AccessDenied onBackToDashboard={() => setActiveView(ViewType.DASHBOARD)} />;
    }
    switch (activeView) {
      case ViewType.DASHBOARD:
        return <Dashboard 
          projects={projects} 
          clients={clients} 
          transactions={transactions} 
          teamMembers={teamMembers}
          cards={cards}
          pockets={pockets}
          handleNavigation={handleNavigation}
          leads={leads}
          teamProjectPayments={teamProjectPayments}
          packages={packages}
          assets={assets}
          clientFeedback={clientFeedback}
          contracts={contracts}
          currentUser={currentUser}
          projectStatusConfig={profile?.projectStatusConfig || []}
        />;
      case ViewType.PROSPEK:
        return <Leads
            leads={leads} setLeads={setLeads}
            clients={clients} setClients={setClients}
            projects={projects} setProjects={setProjects}
            packages={packages} addOns={addOns}
            transactions={transactions} setTransactions={setTransactions}
            userProfile={profile} showNotification={showNotification}
            cards={cards} setCards={setCards}
            pockets={pockets} setPockets={setPockets}
            promoCodes={promoCodes} setPromoCodes={setPromoCodes}
        />;
      case ViewType.CLIENTS:
        return <Clients
          clients={clients} setClients={setClients}
          projects={projects} setProjects={setProjects}
          packages={packages} addOns={addOns}
          transactions={transactions} setTransactions={setTransactions}
          userProfile={profile} showNotification={showNotification}
          showNotification={showNotification}
          initialAction={initialAction} setInitialAction={setInitialAction}
          cards={cards} setCards={setCards}
          pockets={pockets} setPockets={setPockets}
          contracts={contracts}
          handleNavigation={handleNavigation}
          clientFeedback={clientFeedback}
          promoCodes={promoCodes} setPromoCodes={setPromoCodes}
          onSignInvoice={handleSignInvoice}
          onSignTransaction={handleSignTransaction}
        />;
      case ViewType.PROJECTS:
        return <Projects 
          projects={projects} setProjects={setProjects}
          clients={clients}
          packages={packages}
          teamMembers={teamMembers}
          teamProjectPayments={teamProjectPayments} setTeamProjectPayments={setTeamProjectPayments}
          transactions={transactions} setTransactions={setTransactions}
          initialAction={initialAction} setInitialAction={setInitialAction}
          profile={profile}
          showNotification={showNotification}
          cards={cards}
          setCards={setCards}
        />;
      case ViewType.TEAM:
        return (
          <Freelancers
            teamMembers={teamMembers}
            setTeamMembers={setTeamMembers}
            teamProjectPayments={teamProjectPayments}
            setTeamProjectPayments={setTeamProjectPayments}
            teamPaymentRecords={teamPaymentRecords}
            setTeamPaymentRecords={setTeamPaymentRecords}
            transactions={transactions}
            setTransactions={setTransactions}
            userProfile={profile}
            showNotification={showNotification}
            initialAction={initialAction}
            setInitialAction={setInitialAction}
            projects={projects}
            setProjects={setProjects}
            rewardLedgerEntries={rewardLedgerEntries}
            setRewardLedgerEntries={setRewardLedgerEntries}
            pockets={pockets}
            setPockets={setPockets}
            cards={cards}
            setCards={setCards}
            onSignPaymentRecord={handleSignPaymentRecord}
          />
        );
      case ViewType.FINANCE:
        return <Finance 
          transactions={transactions} setTransactions={setTransactions}
          pockets={pockets} setPockets={setPockets}
          projects={projects}
          profile={profile}
          cards={cards} setCards={setCards}
          teamMembers={teamMembers}
          rewardLedgerEntries={rewardLedgerEntries}
        />;
      case ViewType.PACKAGES:
        return <Packages packages={packages} setPackages={setPackages} addOns={addOns} setAddOns={setAddOns} projects={projects} />;
      case ViewType.ASSETS:
        return <Assets assets={assets} setAssets={setAssets} profile={profile} showNotification={showNotification} />;
      case ViewType.CONTRACTS:
        return <Contracts 
            contracts={contracts} setContracts={setContracts}
            clients={clients} projects={projects} profile={profile}
            showNotification={showNotification}
            initialAction={initialAction} setInitialAction={setInitialAction}
            packages={packages}
            onSignContract={handleSignContract}
        />;
      case ViewType.SOP:
        return <SOPManagement sops={sops} setSops={setSops} profile={profile} showNotification={showNotification} />;
      case ViewType.SETTINGS:
        return <Settings 
          profile={profile} setProfile={setProfile} 
          transactions={transactions} projects={projects}
          users={users} setUsers={setUsers}
          currentUser={currentUser}
        />;
      case ViewType.CALENDAR:
        return <CalendarView projects={projects} setProjects={setProjects} teamMembers={teamMembers} profile={profile} />;
      case ViewType.CLIENT_REPORTS:
        return <ClientReports 
            clients={clients}
            leads={leads}
            projects={projects}
            feedback={clientFeedback}
            setFeedback={setClientFeedback}
            showNotification={showNotification}
        />;
      case ViewType.SOCIAL_MEDIA_PLANNER:
        return <SocialPlanner posts={socialMediaPosts} setPosts={setSocialMediaPosts} projects={projects} showNotification={showNotification} />;
      case ViewType.PROMO_CODES:
        return <PromoCodes promoCodes={promoCodes} setPromoCodes={setPromoCodes} projects={projects} showNotification={showNotification} />;
      default:
        return <Dashboard 
          projects={projects} 
          clients={clients} 
          transactions={transactions} 
          teamMembers={teamMembers}
          cards={cards}
          pockets={pockets}
          handleNavigation={handleNavigation}
          leads={leads}
          teamProjectPayments={teamProjectPayments}
          packages={packages}
          assets={assets}
          clientFeedback={clientFeedback}
          contracts={contracts}
          currentUser={currentUser}
          projectStatusConfig={profile?.projectStatusConfig || []}
        />;
    }
  };
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent mx-auto mb-4"></div>
          <p className="text-brand-text-primary">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4">
        <div className="text-center bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-border">
          <h2 className="text-xl font-bold text-brand-danger mb-4">Error Loading Data</h2>
          <p className="text-brand-text-primary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="button-primary"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  // Show message if profile is not set up
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4">
        <div className="text-center bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-border">
          <h2 className="text-xl font-bold text-brand-text-light mb-4">Setup Required</h2>
          <p className="text-brand-text-primary mb-4">Please complete the initial setup in Settings.</p>
          <button 
            onClick={() => {
              setIsAuthenticated(true);
              setCurrentUser(MOCK_USERS[0]);
              setActiveView(ViewType.SETTINGS);
            }} 
            className="button-primary"
          >
            Go to Settings
          </button>
        </div>
      </div>
    );
  }
  
  // ROUTING FOR PUBLIC PAGES
  if (route.startsWith('#/public-booking')) {
    return <PublicBookingForm 
        setClients={setClients}
        setProjects={setProjects}
        packages={packages}
        addOns={addOns}
        setTransactions={setTransactions}
        userProfile={profile}
        cards={cards}
        setCards={setCards}
        pockets={pockets}
        setPockets={setPockets}
        promoCodes={promoCodes}
        setPromoCodes={setPromoCodes}
        showNotification={showNotification}
        setLeads={setLeads}
    />;
  }
  if (route.startsWith('#/public-lead-form')) {
    return <PublicLeadForm 
        setLeads={setLeads}
        userProfile={profile}
        showNotification={showNotification}
    />;
  }
  if (route.startsWith('#/feedback')) {
    return <PublicFeedbackForm setClientFeedback={setClientFeedback} />;
  }
  if (route.startsWith('#/suggestion-form')) {
    return <SuggestionForm setLeads={setLeads} />;
  }
  if (route.startsWith('#/revision-form')) {
    return <PublicRevisionForm projects={projects} teamMembers={teamMembers} onUpdateRevision={handleUpdateRevision} />;
  }
  if (route.startsWith('#/portal/')) {
    const accessId = route.split('/portal/')[1];
    return <ClientPortal 
        accessId={accessId} 
        clients={clients} 
        projects={projects} 
        setClientFeedback={setClientFeedback} 
        showNotification={showNotification} 
        contracts={contracts} 
        transactions={transactions}
        profile={profile}
        packages={packages}
        onClientConfirmation={handleClientConfirmation}
        onClientSubStatusConfirmation={handleClientSubStatusConfirmation}
        onSignContract={handleSignContract}
    />;
  }
  if (route.startsWith('#/freelancer-portal/')) {
    const accessId = route.split('/freelancer-portal/')[1];
    return <FreelancerPortal 
        accessId={accessId} 
        teamMembers={teamMembers} 
        projects={projects} 
        teamProjectPayments={teamProjectPayments}
        teamPaymentRecords={teamPaymentRecords}
        rewardLedgerEntries={rewardLedgerEntries}
        showNotification={showNotification}
        onUpdateRevision={handleUpdateRevision}
        sops={sops}
        profile={profile}
    />;
  }
  
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} users={users} />;
  }

  return (
    <div className="flex h-screen bg-brand-bg text-brand-text-primary">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => handleNavigation(view)} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            pageTitle={activeView} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            setIsSearchOpen={setIsSearchOpen}
            notifications={notifications}
            handleNavigation={handleNavigation}
            handleMarkAllAsRead={handleMarkAllAsRead}
            currentUser={currentUser}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 xl:pb-8">
            {renderView()}
        </main>
      </div>
      {notification && (
        <div className="fixed top-5 right-5 bg-brand-accent text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {notification}
        </div>
      )}
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        clients={clients}
        projects={projects}
        teamMembers={teamMembers}
        handleNavigation={handleNavigation}
      />
      <BottomNavBar activeView={activeView} handleNavigation={handleNavigation} />
      {/* <FloatingActionButton onAddClick={(type) => console.log('Add', type)} /> */}
    </div>
  );
};

export default App;
import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { 
  Client, Project, TeamMember, Transaction, Package, AddOn,
  Card, FinancialPocket, Lead, Asset, Contract, ClientFeedback,
  SocialMediaPost, PromoCode, SOP, Notification, TeamProjectPayment,
  TeamPaymentRecord, RewardLedgerEntry, Profile, User
} from '../types';

export const useSupabaseData = () => {
  // State for all entities
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [pockets, setPockets] = useState<FinancialPocket[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clientFeedback, setClientFeedback] = useState<ClientFeedback[]>([]);
  const [socialMediaPosts, setSocialMediaPosts] = useState<SocialMediaPost[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [sops, setSops] = useState<SOP[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [teamProjectPayments, setTeamProjectPayments] = useState<TeamProjectPayment[]>([]);
  const [teamPaymentRecords, setTeamPaymentRecords] = useState<TeamPaymentRecord[]>([]);
  const [rewardLedgerEntries, setRewardLedgerEntries] = useState<RewardLedgerEntry[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [
          clientsData,
          projectsData,
          teamMembersData,
          transactionsData,
          packagesData,
          addOnsData,
          cardsData,
          pocketsData,
          leadsData,
          assetsData,
          contractsData,
          clientFeedbackData,
          socialMediaPostsData,
          promoCodesData,
          sopsData,
          notificationsData,
          teamProjectPaymentsData,
          teamPaymentRecordsData,
          rewardLedgerEntriesData,
          profileData,
        ] = await Promise.all([
          api.clients.getAll(),
          api.projects.getAll(),
          api.teamMembers.getAll(),
          api.transactions.getAll(),
          api.packages.getAll(),
          api.addOns.getAll(),
          api.cards.getAll(),
          api.pockets.getAll(),
          api.leads.getAll(),
          api.assets.getAll(),
          api.contracts.getAll(),
          api.clientFeedback.getAll(),
          api.socialMediaPosts.getAll(),
          api.promoCodes.getAll(),
          api.sops.getAll(),
          api.notifications.getAll(),
          api.teamProjectPayments.getAll(),
          api.teamPaymentRecords.getAll(),
          api.rewardLedgerEntries.getAll(),
          api.profile.get(),
        ]);

        // Set all state
        setClients(clientsData);
        setProjects(projectsData);
        setTeamMembers(teamMembersData);
        setTransactions(transactionsData);
        setPackages(packagesData);
        setAddOns(addOnsData);
        setCards(cardsData);
        setPockets(pocketsData);
        setLeads(leadsData);
        setAssets(assetsData);
        setContracts(contractsData);
        setClientFeedback(clientFeedbackData);
        setSocialMediaPosts(socialMediaPostsData);
        setPromoCodes(promoCodesData);
        setSops(sopsData);
        setNotifications(notificationsData);
        setTeamProjectPayments(teamProjectPaymentsData);
        setTeamPaymentRecords(teamPaymentRecordsData);
        setRewardLedgerEntries(rewardLedgerEntriesData);
        setProfile(profileData);

      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // CRUD operations with state updates
  const clientsOperations = {
    async create(client: Omit<Client, 'id'>): Promise<Client> {
      const newClient = await api.clients.create(client);
      setClients(prev => [newClient, ...prev]);
      return newClient;
    },
    async update(id: string, updates: Partial<Client>): Promise<Client> {
      const updatedClient = await api.clients.update(id, updates);
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      return updatedClient;
    },
    async delete(id: string): Promise<void> {
      await api.clients.delete(id);
      setClients(prev => prev.filter(c => c.id !== id));
    },
  };

  const projectsOperations = {
    async create(project: Omit<Project, 'id'>): Promise<Project> {
      const newProject = await api.projects.create(project);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    },
    async update(id: string, updates: Partial<Project>): Promise<Project> {
      const updatedProject = await api.projects.update(id, updates);
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
      return updatedProject;
    },
    async delete(id: string): Promise<void> {
      await api.projects.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    },
  };

  const teamMembersOperations = {
    async create(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
      const newMember = await api.teamMembers.create(member);
      setTeamMembers(prev => [...prev, newMember].sort((a, b) => a.name.localeCompare(b.name)));
      return newMember;
    },
    async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
      const updatedMember = await api.teamMembers.update(id, updates);
      setTeamMembers(prev => prev.map(m => m.id === id ? updatedMember : m));
      return updatedMember;
    },
    async delete(id: string): Promise<void> {
      await api.teamMembers.delete(id);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
    },
  };

  const transactionsOperations = {
    async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
      const newTransaction = await api.transactions.create(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    },
    async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
      const updatedTransaction = await api.transactions.update(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      return updatedTransaction;
    },
    async delete(id: string): Promise<void> {
      await api.transactions.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    },
  };

  const packagesOperations = {
    async create(pkg: Omit<Package, 'id'>): Promise<Package> {
      const newPackage = await api.packages.create(pkg);
      setPackages(prev => [...prev, newPackage]);
      return newPackage;
    },
    async update(id: string, updates: Partial<Package>): Promise<Package> {
      const updatedPackage = await api.packages.update(id, updates);
      setPackages(prev => prev.map(p => p.id === id ? updatedPackage : p));
      return updatedPackage;
    },
    async delete(id: string): Promise<void> {
      await api.packages.delete(id);
      setPackages(prev => prev.filter(p => p.id !== id));
    },
  };

  const addOnsOperations = {
    async create(addOn: Omit<AddOn, 'id'>): Promise<AddOn> {
      const newAddOn = await api.addOns.create(addOn);
      setAddOns(prev => [...prev, newAddOn]);
      return newAddOn;
    },
    async update(id: string, updates: Partial<AddOn>): Promise<AddOn> {
      const updatedAddOn = await api.addOns.update(id, updates);
      setAddOns(prev => prev.map(a => a.id === id ? updatedAddOn : a));
      return updatedAddOn;
    },
    async delete(id: string): Promise<void> {
      await api.addOns.delete(id);
      setAddOns(prev => prev.filter(a => a.id !== id));
    },
  };

  const profileOperations = {
    async update(updates: Partial<Profile>): Promise<Profile> {
      const updatedProfile = await api.profile.update(updates);
      setProfile(updatedProfile);
      return updatedProfile;
    },
  };

  // Create operations for remaining entities
  const createOperations = <T extends { id: string }>(
    apiEndpoint: any,
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) => ({
    async create(item: Omit<T, 'id'>): Promise<T> {
      const newItem = await apiEndpoint.create(item);
      setState(prev => [newItem, ...prev]);
      return newItem;
    },
    async update(id: string, updates: Partial<T>): Promise<T> {
      const updatedItem = await apiEndpoint.update(id, updates);
      setState(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    },
    async delete(id: string): Promise<void> {
      await apiEndpoint.delete(id);
      setState(prev => prev.filter(item => item.id !== id));
    },
  });

  return {
    // State
    clients, setClients,
    projects, setProjects,
    teamMembers, setTeamMembers,
    transactions, setTransactions,
    packages, setPackages,
    addOns, setAddOns,
    cards, setCards,
    pockets, setPockets,
    leads, setLeads,
    assets, setAssets,
    contracts, setContracts,
    clientFeedback, setClientFeedback,
    socialMediaPosts, setSocialMediaPosts,
    promoCodes, setPromoCodes,
    sops, setSops,
    notifications, setNotifications,
    teamProjectPayments, setTeamProjectPayments,
    teamPaymentRecords, setTeamPaymentRecords,
    rewardLedgerEntries, setRewardLedgerEntries,
    profile, setProfile,
    users, setUsers,
    loading,
    error,

    // Operations
    clientsOps: clientsOperations,
    projectsOps: projectsOperations,
    teamMembersOps: teamMembersOperations,
    transactionsOps: transactionsOperations,
    packagesOps: packagesOperations,
    addOnsOps: addOnsOperations,
    profileOps: profileOperations,
    leadsOps: createOperations(api.leads, setLeads),
    assetsOps: createOperations(api.assets, setAssets),
    cardsOps: createOperations(api.cards, setCards),
    pocketsOps: createOperations(api.pockets, setPockets),
    contractsOps: createOperations(api.contracts, setContracts),
    clientFeedbackOps: createOperations(api.clientFeedback, setClientFeedback),
    socialMediaPostsOps: createOperations(api.socialMediaPosts, setSocialMediaPosts),
    promoCodesOps: createOperations(api.promoCodes, setPromoCodes),
    sopsOps: createOperations(api.sops, setSops),
    notificationsOps: createOperations(api.notifications, setNotifications),
    teamProjectPaymentsOps: createOperations(api.teamProjectPayments, setTeamProjectPayments),
    teamPaymentRecordsOps: createOperations(api.teamPaymentRecords, setTeamPaymentRecords),
    rewardLedgerEntriesOps: createOperations(api.rewardLedgerEntries, setRewardLedgerEntries),
  };
};
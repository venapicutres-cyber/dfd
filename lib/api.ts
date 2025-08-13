import { supabase, handleSupabaseError } from './supabase';
import { 
  Client, Project, TeamMember, Transaction, Package, AddOn, 
  Card, FinancialPocket, Lead, Asset, Contract, ClientFeedback,
  SocialMediaPost, PromoCode, SOP, Notification, TeamProjectPayment,
  TeamPaymentRecord, RewardLedgerEntry, Revision, Profile
} from '../types';

// Type conversion helpers
const convertDatabaseToClient = (row: any): Client => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  instagram: row.instagram || '',
  since: row.since,
  status: row.status,
  clientType: row.client_type,
  lastContact: row.last_contact,
  portalAccessId: row.portal_access_id,
});

const convertClientToDatabase = (client: Partial<Client>) => ({
  name: client.name,
  email: client.email,
  phone: client.phone,
  instagram: client.instagram,
  since: client.since,
  status: client.status,
  client_type: client.clientType,
  last_contact: client.lastContact,
  portal_access_id: client.portalAccessId,
});

const convertDatabaseToProject = (row: any): Project => ({
  id: row.id,
  projectName: row.project_name,
  clientName: row.client_name,
  clientId: row.client_id,
  projectType: row.project_type,
  packageName: row.package_name,
  packageId: row.package_id,
  addOns: row.add_ons || [],
  date: row.date,
  deadlineDate: row.deadline_date,
  location: row.location,
  progress: row.progress,
  status: row.status,
  activeSubStatuses: row.active_sub_statuses || [],
  totalCost: row.total_cost,
  amountPaid: row.amount_paid,
  paymentStatus: row.payment_status,
  team: row.team || [],
  notes: row.notes,
  accommodation: row.accommodation,
  driveLink: row.drive_link,
  clientDriveLink: row.client_drive_link,
  finalDriveLink: row.final_drive_link,
  startTime: row.start_time,
  endTime: row.end_time,
  image: row.image,
  promoCodeId: row.promo_code_id,
  discountAmount: row.discount_amount,
  shippingDetails: row.shipping_details,
  dpProofUrl: row.dp_proof_url,
  printingDetails: row.printing_details || [],
  printingCost: row.printing_cost,
  transportCost: row.transport_cost,
  isEditingConfirmedByClient: row.is_editing_confirmed_by_client,
  isPrintingConfirmedByClient: row.is_printing_confirmed_by_client,
  isDeliveryConfirmedByClient: row.is_delivery_confirmed_by_client,
  confirmedSubStatuses: row.confirmed_sub_statuses || [],
  clientSubStatusNotes: row.client_sub_status_notes || {},
  subStatusConfirmationSentAt: row.sub_status_confirmation_sent_at || {},
  completedDigitalItems: row.completed_digital_items || [],
  invoiceSignature: row.invoice_signature,
  revisions: [], // Will be loaded separately
});

const convertProjectToDatabase = (project: Partial<Project>) => ({
  project_name: project.projectName,
  client_name: project.clientName,
  client_id: project.clientId,
  project_type: project.projectType,
  package_name: project.packageName,
  package_id: project.packageId,
  add_ons: project.addOns,
  date: project.date,
  deadline_date: project.deadlineDate,
  location: project.location,
  progress: project.progress,
  status: project.status,
  active_sub_statuses: project.activeSubStatuses,
  total_cost: project.totalCost,
  amount_paid: project.amountPaid,
  payment_status: project.paymentStatus,
  team: project.team,
  notes: project.notes,
  accommodation: project.accommodation,
  drive_link: project.driveLink,
  client_drive_link: project.clientDriveLink,
  final_drive_link: project.finalDriveLink,
  start_time: project.startTime,
  end_time: project.endTime,
  image: project.image,
  promo_code_id: project.promoCodeId,
  discount_amount: project.discountAmount,
  shipping_details: project.shippingDetails,
  dp_proof_url: project.dpProofUrl,
  printing_details: project.printingDetails,
  printing_cost: project.printingCost,
  transport_cost: project.transportCost,
  is_editing_confirmed_by_client: project.isEditingConfirmedByClient,
  is_printing_confirmed_by_client: project.isPrintingConfirmedByClient,
  is_delivery_confirmed_by_client: project.isDeliveryConfirmedByClient,
  confirmed_sub_statuses: project.confirmedSubStatuses,
  client_sub_status_notes: project.clientSubStatusNotes,
  sub_status_confirmation_sent_at: project.subStatusConfirmationSentAt,
  completed_digital_items: project.completedDigitalItems,
  invoice_signature: project.invoiceSignature,
});

// API Functions

// Clients API
export const clientsApi = {
  async getAll(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(convertDatabaseToClient);
    } catch (error) {
      handleSupabaseError(error, 'fetch clients');
      return [];
    }
  },

  async create(client: Omit<Client, 'id'>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([convertClientToDatabase(client)])
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToClient(data);
    } catch (error) {
      handleSupabaseError(error, 'create client');
      throw error;
    }
  },

  async update(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(convertClientToDatabase(updates))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToClient(data);
    } catch (error) {
      handleSupabaseError(error, 'update client');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete client');
      throw error;
    }
  },
};

// Projects API
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Load revisions for each project
      const projects = data.map(convertDatabaseToProject);
      for (const project of projects) {
        const { data: revisions } = await supabase
          .from('revisions')
          .select('*')
          .eq('project_id', project.id);
        
        project.revisions = revisions?.map(convertDatabaseToRevision) || [];
      }
      
      return projects;
    } catch (error) {
      handleSupabaseError(error, 'fetch projects');
      return [];
    }
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([convertProjectToDatabase(project)])
        .select()
        .single();
      
      if (error) throw error;
      const newProject = convertDatabaseToProject(data);
      newProject.revisions = [];
      return newProject;
    } catch (error) {
      handleSupabaseError(error, 'create project');
      throw error;
    }
  },

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(convertProjectToDatabase(updates))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToProject(data);
    } catch (error) {
      handleSupabaseError(error, 'update project');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete project');
      throw error;
    }
  },
};

// Similar conversion functions for other entities
const convertDatabaseToTeamMember = (row: any): TeamMember => ({
  id: row.id,
  name: row.name,
  role: row.role,
  email: row.email,
  phone: row.phone,
  standardFee: row.standard_fee,
  noRek: row.no_rek,
  rewardBalance: row.reward_balance,
  rating: row.rating,
  performanceNotes: row.performance_notes || [],
  portalAccessId: row.portal_access_id,
});

const convertTeamMemberToDatabase = (member: Partial<TeamMember>) => ({
  name: member.name,
  role: member.role,
  email: member.email,
  phone: member.phone,
  standard_fee: member.standardFee,
  no_rek: member.noRek,
  reward_balance: member.rewardBalance,
  rating: member.rating,
  performance_notes: member.performanceNotes,
  portal_access_id: member.portalAccessId,
});

const convertDatabaseToTransaction = (row: any): Transaction => ({
  id: row.id,
  date: row.date,
  description: row.description,
  amount: row.amount,
  type: row.type,
  projectId: row.project_id,
  category: row.category,
  method: row.method,
  pocketId: row.pocket_id,
  cardId: row.card_id,
  printingItemId: row.printing_item_id,
  vendorSignature: row.vendor_signature,
});

const convertTransactionToDatabase = (transaction: Partial<Transaction>) => ({
  date: transaction.date,
  description: transaction.description,
  amount: transaction.amount,
  type: transaction.type,
  project_id: transaction.projectId,
  category: transaction.category,
  method: transaction.method,
  pocket_id: transaction.pocketId,
  card_id: transaction.cardId,
  printing_item_id: transaction.printingItemId,
  vendor_signature: transaction.vendorSignature,
});

const convertDatabaseToRevision = (row: any): Revision => ({
  id: row.id,
  date: row.date,
  adminNotes: row.admin_notes,
  deadline: row.deadline,
  freelancerId: row.freelancer_id,
  status: row.status,
  freelancerNotes: row.freelancer_notes,
  driveLink: row.drive_link,
  completedDate: row.completed_date,
});

const convertRevisionToDatabase = (revision: Partial<Revision>) => ({
  project_id: revision.projectId,
  date: revision.date,
  admin_notes: revision.adminNotes,
  deadline: revision.deadline,
  freelancer_id: revision.freelancerId,
  status: revision.status,
  freelancer_notes: revision.freelancerNotes,
  drive_link: revision.driveLink,
  completed_date: revision.completedDate,
});

// Team Members API
export const teamMembersApi = {
  async getAll(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data.map(convertDatabaseToTeamMember);
    } catch (error) {
      handleSupabaseError(error, 'fetch team members');
      return [];
    }
  },

  async create(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([convertTeamMemberToDatabase(member)])
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToTeamMember(data);
    } catch (error) {
      handleSupabaseError(error, 'create team member');
      throw error;
    }
  },

  async update(id: string, updates: Partial<TeamMember>): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(convertTeamMemberToDatabase(updates))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToTeamMember(data);
    } catch (error) {
      handleSupabaseError(error, 'update team member');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete team member');
      throw error;
    }
  },
};

// Transactions API
export const transactionsApi = {
  async getAll(): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data.map(convertDatabaseToTransaction);
    } catch (error) {
      handleSupabaseError(error, 'fetch transactions');
      return [];
    }
  },

  async create(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([convertTransactionToDatabase(transaction)])
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToTransaction(data);
    } catch (error) {
      handleSupabaseError(error, 'create transaction');
      throw error;
    }
  },

  async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(convertTransactionToDatabase(updates))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToTransaction(data);
    } catch (error) {
      handleSupabaseError(error, 'update transaction');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete transaction');
      throw error;
    }
  },
};

// Packages API
export const packagesApi = {
  async getAll(): Promise<Package[]> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
        physicalItems: row.physical_items || [],
        digitalItems: row.digital_items || [],
        processingTime: row.processing_time,
        photographers: row.photographers,
        videographers: row.videographers,
      }));
    } catch (error) {
      handleSupabaseError(error, 'fetch packages');
      return [];
    }
  },

  async create(pkg: Omit<Package, 'id'>): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .insert([{
          name: pkg.name,
          price: pkg.price,
          physical_items: pkg.physicalItems,
          digital_items: pkg.digitalItems,
          processing_time: pkg.processingTime,
          photographers: pkg.photographers,
          videographers: pkg.videographers,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        physicalItems: data.physical_items || [],
        digitalItems: data.digital_items || [],
        processingTime: data.processing_time,
        photographers: data.photographers,
        videographers: data.videographers,
      };
    } catch (error) {
      handleSupabaseError(error, 'create package');
      throw error;
    }
  },

  async update(id: string, updates: Partial<Package>): Promise<Package> {
    try {
      const { data, error } = await supabase
        .from('packages')
        .update({
          name: updates.name,
          price: updates.price,
          physical_items: updates.physicalItems,
          digital_items: updates.digitalItems,
          processing_time: updates.processingTime,
          photographers: updates.photographers,
          videographers: updates.videographers,
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        physicalItems: data.physical_items || [],
        digitalItems: data.digital_items || [],
        processingTime: data.processing_time,
        photographers: data.photographers,
        videographers: data.videographers,
      };
    } catch (error) {
      handleSupabaseError(error, 'update package');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete package');
      throw error;
    }
  },
};

// Add-ons API
export const addOnsApi = {
  async getAll(): Promise<AddOn[]> {
    try {
      const { data, error } = await supabase
        .from('add_ons')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data.map(row => ({
        id: row.id,
        name: row.name,
        price: row.price,
      }));
    } catch (error) {
      handleSupabaseError(error, 'fetch add-ons');
      return [];
    }
  },

  async create(addOn: Omit<AddOn, 'id'>): Promise<AddOn> {
    try {
      const { data, error } = await supabase
        .from('add_ons')
        .insert([addOn])
        .select()
        .single();
      
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price,
      };
    } catch (error) {
      handleSupabaseError(error, 'create add-on');
      throw error;
    }
  },

  async update(id: string, updates: Partial<AddOn>): Promise<AddOn> {
    try {
      const { data, error } = await supabase
        .from('add_ons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return {
        id: data.id,
        name: data.name,
        price: data.price,
      };
    } catch (error) {
      handleSupabaseError(error, 'update add-on');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('add_ons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete add-on');
      throw error;
    }
  },
};

// Profile API
export const profileApi = {
  async get(): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      if (!data) return null;
      
      return {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        companyName: data.company_name,
        website: data.website,
        address: data.address,
        bankAccount: data.bank_account,
        authorizedSigner: data.authorized_signer,
        idNumber: data.id_number,
        bio: data.bio,
        incomeCategories: data.income_categories || [],
        expenseCategories: data.expense_categories || [],
        projectTypes: data.project_types || [],
        eventTypes: data.event_types || [],
        assetCategories: data.asset_categories || [],
        sopCategories: data.sop_categories || [],
        projectStatusConfig: data.project_status_config || [],
        notificationSettings: data.notification_settings || {},
        securitySettings: data.security_settings || {},
        briefingTemplate: data.briefing_template,
        termsAndConditions: data.terms_and_conditions,
      };
    } catch (error) {
      handleSupabaseError(error, 'fetch profile');
      return null;
    }
  },

  async update(profile: Partial<Profile>): Promise<Profile> {
    try {
      const profileData = {
        full_name: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        company_name: profile.companyName,
        website: profile.website,
        address: profile.address,
        bank_account: profile.bankAccount,
        authorized_signer: profile.authorizedSigner,
        id_number: profile.idNumber,
        bio: profile.bio,
        income_categories: profile.incomeCategories,
        expense_categories: profile.expenseCategories,
        project_types: profile.projectTypes,
        event_types: profile.eventTypes,
        asset_categories: profile.assetCategories,
        sop_categories: profile.sopCategories,
        project_status_config: profile.projectStatusConfig,
        notification_settings: profile.notificationSettings,
        security_settings: profile.securitySettings,
        briefing_template: profile.briefingTemplate,
        terms_and_conditions: profile.termsAndConditions,
      };

      // Check if profile exists
      const { data: existing } = await supabase
        .from('profile')
        .select('id')
        .limit(1)
        .single();

      let data, error;
      if (existing) {
        // Update existing profile
        const result = await supabase
          .from('profile')
          .update(profileData)
          .eq('id', existing.id)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Create new profile
        const result = await supabase
          .from('profile')
          .insert([profileData])
          .select()
          .single();
        data = result.data;
        error = result.error;
      }
      
      if (error) throw error;
      
      return {
        fullName: data.full_name,
        email: data.email,
        phone: data.phone,
        companyName: data.company_name,
        website: data.website,
        address: data.address,
        bankAccount: data.bank_account,
        authorizedSigner: data.authorized_signer,
        idNumber: data.id_number,
        bio: data.bio,
        incomeCategories: data.income_categories || [],
        expenseCategories: data.expense_categories || [],
        projectTypes: data.project_types || [],
        eventTypes: data.event_types || [],
        assetCategories: data.asset_categories || [],
        sopCategories: data.sop_categories || [],
        projectStatusConfig: data.project_status_config || [],
        notificationSettings: data.notification_settings || {},
        securitySettings: data.security_settings || {},
        briefingTemplate: data.briefing_template,
        termsAndConditions: data.terms_and_conditions,
      };
    } catch (error) {
      handleSupabaseError(error, 'update profile');
      throw error;
    }
  },
};

// Generic API functions for simpler entities
export const createGenericApi = <T extends { id: string }>(tableName: string, converter?: {
  fromDb: (row: any) => T;
  toDb: (item: Partial<T>) => any;
}) => ({
  async getAll(): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return converter ? data.map(converter.fromDb) : data;
    } catch (error) {
      handleSupabaseError(error, `fetch ${tableName}`);
      return [];
    }
  },

  async create(item: Omit<T, 'id'>): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert([converter ? converter.toDb(item) : item])
        .select()
        .single();
      
      if (error) throw error;
      return converter ? converter.fromDb(data) : data;
    } catch (error) {
      handleSupabaseError(error, `create ${tableName}`);
      throw error;
    }
  },

  async update(id: string, updates: Partial<T>): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(converter ? converter.toDb(updates) : updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return converter ? converter.fromDb(data) : data;
    } catch (error) {
      handleSupabaseError(error, `update ${tableName}`);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, `delete ${tableName}`);
      throw error;
    }
  },
});

// Create APIs for remaining entities
export const leadsApi = createGenericApi<Lead>('leads', {
  fromDb: (row: any) => ({
    id: row.id,
    name: row.name,
    contactChannel: row.contact_channel,
    location: row.location,
    status: row.status,
    date: row.date,
    notes: row.notes,
  }),
  toDb: (lead: Partial<Lead>) => ({
    name: lead.name,
    contact_channel: lead.contactChannel,
    location: lead.location,
    status: lead.status,
    date: lead.date,
    notes: lead.notes,
  }),
});

export const assetsApi = createGenericApi<Asset>('assets', {
  fromDb: (row: any) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    purchaseDate: row.purchase_date,
    purchasePrice: row.purchase_price,
    serialNumber: row.serial_number,
    status: row.status,
    notes: row.notes,
  }),
  toDb: (asset: Partial<Asset>) => ({
    name: asset.name,
    category: asset.category,
    purchase_date: asset.purchaseDate,
    purchase_price: asset.purchasePrice,
    serial_number: asset.serialNumber,
    status: asset.status,
    notes: asset.notes,
  }),
});

export const cardsApi = createGenericApi<Card>('cards', {
  fromDb: (row: any) => ({
    id: row.id,
    cardHolderName: row.card_holder_name,
    bankName: row.bank_name,
    cardType: row.card_type,
    lastFourDigits: row.last_four_digits,
    expiryDate: row.expiry_date,
    balance: row.balance,
    colorGradient: row.color_gradient,
  }),
  toDb: (card: Partial<Card>) => ({
    card_holder_name: card.cardHolderName,
    bank_name: card.bankName,
    card_type: card.cardType,
    last_four_digits: card.lastFourDigits,
    expiry_date: card.expiryDate,
    balance: card.balance,
    color_gradient: card.colorGradient,
  }),
});

export const pocketsApi = createGenericApi<FinancialPocket>('financial_pockets', {
  fromDb: (row: any) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    type: row.type,
    amount: row.amount,
    goalAmount: row.goal_amount,
    lockEndDate: row.lock_end_date,
    members: row.members || [],
    sourceCardId: row.source_card_id,
  }),
  toDb: (pocket: Partial<FinancialPocket>) => ({
    name: pocket.name,
    description: pocket.description,
    icon: pocket.icon,
    type: pocket.type,
    amount: pocket.amount,
    goal_amount: pocket.goalAmount,
    lock_end_date: pocket.lockEndDate,
    members: pocket.members,
    source_card_id: pocket.sourceCardId,
  }),
});

// Revisions API
export const revisionsApi = {
  async getByProject(projectId: string): Promise<Revision[]> {
    try {
      const { data, error } = await supabase
        .from('revisions')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data.map(convertDatabaseToRevision);
    } catch (error) {
      handleSupabaseError(error, 'fetch revisions');
      return [];
    }
  },

  async create(revision: Omit<Revision, 'id'> & { projectId: string }): Promise<Revision> {
    try {
      const { data, error } = await supabase
        .from('revisions')
        .insert([convertRevisionToDatabase(revision)])
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToRevision(data);
    } catch (error) {
      handleSupabaseError(error, 'create revision');
      throw error;
    }
  },

  async update(id: string, updates: Partial<Revision>): Promise<Revision> {
    try {
      const { data, error } = await supabase
        .from('revisions')
        .update(convertRevisionToDatabase(updates))
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return convertDatabaseToRevision(data);
    } catch (error) {
      handleSupabaseError(error, 'update revision');
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('revisions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error, 'delete revision');
      throw error;
    }
  },
};

// Export all APIs
export const api = {
  clients: clientsApi,
  projects: projectsApi,
  teamMembers: teamMembersApi,
  transactions: transactionsApi,
  packages: packagesApi,
  addOns: addOnsApi,
  leads: leadsApi,
  assets: assetsApi,
  cards: cardsApi,
  pockets: pocketsApi,
  revisions: revisionsApi,
  profile: profileApi,
  
  // Simple APIs for remaining entities
  contracts: createGenericApi<Contract>('contracts'),
  clientFeedback: createGenericApi<ClientFeedback>('client_feedback'),
  socialMediaPosts: createGenericApi<SocialMediaPost>('social_media_posts'),
  promoCodes: createGenericApi<PromoCode>('promo_codes'),
  sops: createGenericApi<SOP>('sops'),
  notifications: createGenericApi<Notification>('notifications'),
  teamProjectPayments: createGenericApi<TeamProjectPayment>('team_project_payments'),
  teamPaymentRecords: createGenericApi<TeamPaymentRecord>('team_payment_records'),
  rewardLedgerEntries: createGenericApi<RewardLedgerEntry>('reward_ledger_entries'),
};
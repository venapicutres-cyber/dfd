import { supabase } from './supabase';
import { 
  MOCK_CLIENTS, MOCK_PROJECTS, MOCK_TEAM_MEMBERS, MOCK_TRANSACTIONS, 
  MOCK_PACKAGES, MOCK_ADDONS, MOCK_TEAM_PROJECT_PAYMENTS, MOCK_USER_PROFILE, 
  MOCK_FINANCIAL_POCKETS, MOCK_TEAM_PAYMENT_RECORDS, MOCK_LEADS, 
  MOCK_REWARD_LEDGER_ENTRIES, MOCK_CARDS, MOCK_ASSETS, MOCK_CLIENT_FEEDBACK, 
  MOCK_CONTRACTS, MOCK_NOTIFICATIONS, MOCK_SOCIAL_MEDIA_POSTS, 
  MOCK_PROMO_CODES, MOCK_SOPS 
} from '../constants';

export const importMockDataToSupabase = async () => {
  try {
    console.log('Starting mock data import to Supabase...');

    // Import profile
    const profileData = {
      full_name: MOCK_USER_PROFILE.fullName,
      email: MOCK_USER_PROFILE.email,
      phone: MOCK_USER_PROFILE.phone,
      company_name: MOCK_USER_PROFILE.companyName,
      website: MOCK_USER_PROFILE.website,
      address: MOCK_USER_PROFILE.address,
      bank_account: MOCK_USER_PROFILE.bankAccount,
      authorized_signer: MOCK_USER_PROFILE.authorizedSigner,
      id_number: MOCK_USER_PROFILE.idNumber,
      bio: MOCK_USER_PROFILE.bio,
      income_categories: MOCK_USER_PROFILE.incomeCategories,
      expense_categories: MOCK_USER_PROFILE.expenseCategories,
      project_types: MOCK_USER_PROFILE.projectTypes,
      event_types: MOCK_USER_PROFILE.eventTypes,
      asset_categories: MOCK_USER_PROFILE.assetCategories,
      sop_categories: MOCK_USER_PROFILE.sopCategories,
      project_status_config: MOCK_USER_PROFILE.projectStatusConfig,
      notification_settings: MOCK_USER_PROFILE.notificationSettings,
      security_settings: MOCK_USER_PROFILE.securitySettings,
      briefing_template: MOCK_USER_PROFILE.briefingTemplate,
      terms_and_conditions: MOCK_USER_PROFILE.termsAndConditions,
    };

    await supabase.from('profile').upsert([profileData]);

    // Import packages
    const packagesData = MOCK_PACKAGES.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      physical_items: pkg.physicalItems,
      digital_items: pkg.digitalItems,
      processing_time: pkg.processingTime,
      photographers: pkg.photographers,
      videographers: pkg.videographers,
    }));
    await supabase.from('packages').upsert(packagesData);

    // Import add-ons
    const addOnsData = MOCK_ADDONS.map(addon => ({
      id: addon.id,
      name: addon.name,
      price: addon.price,
    }));
    await supabase.from('add_ons').upsert(addOnsData);

    // Import cards
    const cardsData = MOCK_CARDS.map(card => ({
      id: card.id,
      card_holder_name: card.cardHolderName,
      bank_name: card.bankName,
      card_type: card.cardType,
      last_four_digits: card.lastFourDigits,
      expiry_date: card.expiryDate,
      balance: card.balance,
      color_gradient: card.colorGradient,
    }));
    await supabase.from('cards').upsert(cardsData);

    // Import financial pockets
    const pocketsData = MOCK_FINANCIAL_POCKETS.map(pocket => ({
      id: pocket.id,
      name: pocket.name,
      description: pocket.description,
      icon: pocket.icon,
      type: pocket.type,
      amount: pocket.amount,
      goal_amount: pocket.goalAmount,
      lock_end_date: pocket.lockEndDate,
      members: pocket.members,
      source_card_id: pocket.sourceCardId,
    }));
    await supabase.from('financial_pockets').upsert(pocketsData);

    // Import team members
    const teamMembersData = MOCK_TEAM_MEMBERS.map(member => ({
      id: member.id,
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
    }));
    await supabase.from('team_members').upsert(teamMembersData);

    // Import clients
    const clientsData = MOCK_CLIENTS.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      instagram: client.instagram,
      since: client.since,
      status: client.status,
      client_type: client.clientType,
      last_contact: client.lastContact,
      portal_access_id: client.portalAccessId,
    }));
    await supabase.from('clients').upsert(clientsData);

    // Import projects
    const projectsData = MOCK_PROJECTS.map(project => ({
      id: project.id,
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
    }));
    await supabase.from('projects').upsert(projectsData);

    // Import transactions
    const transactionsData = MOCK_TRANSACTIONS.map(transaction => ({
      id: transaction.id,
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
    }));
    await supabase.from('transactions').upsert(transactionsData);

    // Import leads
    const leadsData = MOCK_LEADS.map(lead => ({
      id: lead.id,
      name: lead.name,
      contact_channel: lead.contactChannel,
      location: lead.location,
      status: lead.status,
      date: lead.date,
      notes: lead.notes,
    }));
    await supabase.from('leads').upsert(leadsData);

    // Import assets
    const assetsData = MOCK_ASSETS.map(asset => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      purchase_date: asset.purchaseDate,
      purchase_price: asset.purchasePrice,
      serial_number: asset.serialNumber,
      status: asset.status,
      notes: asset.notes,
    }));
    await supabase.from('assets').upsert(assetsData);

    // Import client feedback
    const feedbackData = MOCK_CLIENT_FEEDBACK.map(feedback => ({
      id: feedback.id,
      client_name: feedback.clientName,
      satisfaction: feedback.satisfaction,
      rating: feedback.rating,
      feedback: feedback.feedback,
      date: feedback.date,
    }));
    await supabase.from('client_feedback').upsert(feedbackData);

    // Import contracts
    const contractsData = MOCK_CONTRACTS.map(contract => ({
      id: contract.id,
      contract_number: contract.contractNumber,
      client_id: contract.clientId,
      project_id: contract.projectId,
      signing_date: contract.signingDate,
      signing_location: contract.signingLocation,
      client_name1: contract.clientName1,
      client_address1: contract.clientAddress1,
      client_phone1: contract.clientPhone1,
      client_name2: contract.clientName2,
      client_address2: contract.clientAddress2,
      client_phone2: contract.clientPhone2,
      shooting_duration: contract.shootingDuration,
      guaranteed_photos: contract.guaranteedPhotos,
      album_details: contract.albumDetails,
      digital_files_format: contract.digitalFilesFormat,
      other_items: contract.otherItems,
      personnel_count: contract.personnelCount,
      delivery_timeframe: contract.deliveryTimeframe,
      dp_date: contract.dpDate,
      final_payment_date: contract.finalPaymentDate,
      cancellation_policy: contract.cancellationPolicy,
      jurisdiction: contract.jurisdiction,
      vendor_signature: contract.vendorSignature,
      client_signature: contract.clientSignature,
    }));
    await supabase.from('contracts').upsert(contractsData);

    // Import social media posts
    const socialPostsData = MOCK_SOCIAL_MEDIA_POSTS.map(post => ({
      id: post.id,
      project_id: post.projectId,
      client_name: post.clientName,
      post_type: post.postType,
      platform: post.platform,
      scheduled_date: post.scheduledDate,
      caption: post.caption,
      media_url: post.mediaUrl,
      status: post.status,
      notes: post.notes,
    }));
    await supabase.from('social_media_posts').upsert(socialPostsData);

    // Import promo codes
    const promoCodesData = MOCK_PROMO_CODES.map(promo => ({
      id: promo.id,
      code: promo.code,
      discount_type: promo.discountType,
      discount_value: promo.discountValue,
      is_active: promo.isActive,
      usage_count: promo.usageCount,
      max_usage: promo.maxUsage,
      expiry_date: promo.expiryDate,
    }));
    await supabase.from('promo_codes').upsert(promoCodesData);

    // Import SOPs
    const sopsData = MOCK_SOPS.map(sop => ({
      id: sop.id,
      title: sop.title,
      category: sop.category,
      content: sop.content,
      last_updated: sop.lastUpdated,
    }));
    await supabase.from('sops').upsert(sopsData);

    // Import notifications
    const notificationsData = MOCK_NOTIFICATIONS.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      timestamp: notif.timestamp,
      is_read: notif.isRead,
      icon: notif.icon,
      link: notif.link,
    }));
    await supabase.from('notifications').upsert(notificationsData);

    // Import team project payments
    const teamPaymentsData = MOCK_TEAM_PROJECT_PAYMENTS.map(payment => ({
      id: payment.id,
      project_id: payment.projectId,
      team_member_name: payment.teamMemberName,
      team_member_id: payment.teamMemberId,
      date: payment.date,
      status: payment.status,
      fee: payment.fee,
      reward: payment.reward,
    }));
    await supabase.from('team_project_payments').upsert(teamPaymentsData);

    // Import team payment records
    const paymentRecordsData = MOCK_TEAM_PAYMENT_RECORDS.map(record => ({
      id: record.id,
      record_number: record.recordNumber,
      team_member_id: record.teamMemberId,
      date: record.date,
      project_payment_ids: record.projectPaymentIds,
      total_amount: record.totalAmount,
      vendor_signature: record.vendorSignature,
    }));
    await supabase.from('team_payment_records').upsert(paymentRecordsData);

    // Import reward ledger entries
    const rewardEntriesData = MOCK_REWARD_LEDGER_ENTRIES.map(entry => ({
      id: entry.id,
      team_member_id: entry.teamMemberId,
      date: entry.date,
      description: entry.description,
      amount: entry.amount,
      project_id: entry.projectId,
    }));
    await supabase.from('reward_ledger_entries').upsert(rewardEntriesData);

    console.log('Mock data import completed successfully!');
    return true;
  } catch (error) {
    console.error('Error importing mock data:', error);
    throw error;
  }
};
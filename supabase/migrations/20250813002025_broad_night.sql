/*
  # Seed Initial Data for Vena Pictures Management System

  1. Initial Setup
    - Create default profile configuration
    - Insert sample packages and add-ons
    - Create default financial cards and pockets
    - Add sample team members
    - Insert sample clients and projects
    - Create sample transactions and other data

  2. Data Population
    - All mock data from the application will be imported
    - Maintains existing relationships and structure
    - Provides realistic sample data for testing
*/

-- Insert default profile
INSERT INTO profile (
  full_name, email, phone, company_name, website, address, bank_account, authorized_signer,
  bio, briefing_template, terms_and_conditions
) VALUES (
  'Vena Pictures',
  'info@venapictures.com',
  '+62812345678',
  'Vena Pictures',
  'https://venapictures.com',
  'Jl. Contoh No. 123, Jakarta',
  'BCA 1234567890 a.n. Vena Pictures',
  'Vena Pictures',
  'Vena Pictures adalah studio fotografi profesional yang mengkhususkan diri dalam dokumentasi pernikahan dan acara spesial.',
  'Halo tim! Briefing untuk proyek [PROJECT_NAME] pada [DATE]. Lokasi: [LOCATION]. Tim yang bertugas: [TEAM]. Jangan lupa bawa peralatan lengkap dan datang 30 menit sebelum waktu yang ditentukan. Semangat!',
  '📜 SYARAT & KETENTUAN UMUM VENA PICTURES

📅 PEMESANAN & KONFIRMASI
- Pemesanan dianggap sah setelah pembayaran DP minimal 30% dari total biaya
- Konfirmasi jadwal dilakukan maksimal H-7 sebelum acara
- Perubahan jadwal dapat dilakukan maksimal H-14 dengan biaya tambahan

💰 PEMBAYARAN
- DP: 30-50% saat booking
- Pelunasan: H-3 sebelum acara
- Pembayaran melalui transfer bank ke rekening yang tertera
- Keterlambatan pembayaran dapat mengakibatkan pembatalan sepihak

📦 DELIVERABLES
- Foto digital: 30-50 hari kerja setelah acara
- Album cetak: 45-60 hari kerja setelah acara
- Revisi minor: maksimal 3x untuk penyesuaian warna/crop
- Revisi major (ganti foto): dikenakan biaya tambahan

⏱ WAKTU PELAKSANAAN
- Keterlambatan klien >30 menit mengurangi durasi pemotretan
- Overtime dikenakan biaya tambahan sesuai kesepakatan
- Force majeure (cuaca buruk, dll) dapat mengubah jadwal

➕ LAIN-LAIN
- Hak cipta foto tetap milik Vena Pictures
- Klien mendapat hak pakai untuk keperluan pribadi
- Penggunaan komersial memerlukan izin tertulis
- Vena Pictures berhak menggunakan hasil foto untuk portofolio'
) ON CONFLICT DO NOTHING;

-- Insert sample packages
INSERT INTO packages (id, name, price, physical_items, digital_items, processing_time, photographers, videographers) VALUES
('pkg_1', 'Paket Silver', 3500000, 
 '[{"name": "Album 20x30 (20 halaman)", "price": 500000}]'::jsonb,
 '["50 foto edit terbaik", "File RAW semua foto", "Online gallery 1 tahun"]'::jsonb,
 '30 hari kerja', '1 Fotografer', null),
('pkg_2', 'Paket Gold', 5500000,
 '[{"name": "Album 20x30 (30 halaman)", "price": 750000}, {"name": "Cetak foto 4R (50 lembar)", "price": 250000}]'::jsonb,
 '["100 foto edit terbaik", "File RAW semua foto", "Online gallery 2 tahun", "Video highlight 3-5 menit"]'::jsonb,
 '45 hari kerja', '2 Fotografer', '1 Videografer'),
('pkg_3', 'Paket Platinum', 8500000,
 '[{"name": "Album 25x35 (40 halaman)", "price": 1200000}, {"name": "Cetak foto 4R (100 lembar)", "price": 500000}, {"name": "Frame foto 8R (5 buah)", "price": 300000}]'::jsonb,
 '["200 foto edit terbaik", "File RAW semua foto", "Online gallery unlimited", "Video cinematic 8-10 menit", "Same day edit video"]'::jsonb,
 '60 hari kerja', '3 Fotografer', '2 Videografer')
ON CONFLICT (id) DO NOTHING;

-- Insert sample add-ons
INSERT INTO add_ons (id, name, price) VALUES
('addon_1', 'Drone Photography', 1500000),
('addon_2', 'Extra Photographer', 800000),
('addon_3', 'Live Streaming', 2000000),
('addon_4', 'Photo Booth', 1200000),
('addon_5', 'Extended Hours (+2 jam)', 1000000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample cards
INSERT INTO cards (id, card_holder_name, bank_name, card_type, last_four_digits, balance, color_gradient) VALUES
('card_1', 'Vena Pictures', 'BCA', 'Debit', '7890', 25000000, 'from-blue-500 to-sky-400'),
('card_2', 'Vena Pictures', 'Mandiri', 'Kredit', '1234', 15000000, 'from-purple-500 to-pink-400'),
('card_3', 'Vena Pictures', 'Tunai', 'Debit', '0000', 5000000, 'from-green-500 to-emerald-400')
ON CONFLICT (id) DO NOTHING;

-- Insert sample financial pockets
INSERT INTO financial_pockets (id, name, description, icon, type, amount, goal_amount) VALUES
('pocket_1', 'Dana Darurat', 'Cadangan untuk keperluan mendesak', 'piggy-bank', 'Nabung & Bayar', 10000000, 20000000),
('pocket_2', 'Upgrade Peralatan', 'Tabungan untuk beli kamera baru', 'lock', 'Terkunci', 8000000, 15000000),
('pocket_3', 'Operasional Bulanan', 'Anggaran operasional per bulan', 'clipboard-list', 'Anggaran Pengeluaran', 5000000, 7000000),
('pocket_4', 'Bonus Tim', 'Pool hadiah untuk freelancer', 'star', 'Tabungan Hadiah Freelancer', 3000000, null)
ON CONFLICT (id) DO NOTHING;

-- Insert sample team members
INSERT INTO team_members (id, name, role, email, phone, standard_fee, no_rek, reward_balance, rating, performance_notes, portal_access_id) VALUES
('team_1', 'Andi Pratama', 'Fotografer Utama', 'andi@example.com', '081234567890', 1500000, '1234567890', 500000, 4.8, 
 '[{"id": "note_1", "date": "2024-01-15", "note": "Sangat profesional dalam menangani klien VIP", "type": "Pujian"}]'::jsonb,
 'portal_andi_123'),
('team_2', 'Sari Indah', 'Videografer', 'sari@example.com', '081234567891', 1200000, '1234567891', 300000, 4.9,
 '[{"id": "note_2", "date": "2024-01-20", "note": "Kreatif dalam pengambilan angle video", "type": "Pujian"}]'::jsonb,
 'portal_sari_456'),
('team_3', 'Budi Santoso', 'Editor', 'budi@example.com', '081234567892', 800000, '1234567892', 200000, 4.7,
 '[{"id": "note_3", "date": "2024-01-25", "note": "Perlu meningkatkan kecepatan editing", "type": "Perhatian"}]'::jsonb,
 'portal_budi_789')
ON CONFLICT (id) DO NOTHING;

-- Insert sample clients
INSERT INTO clients (id, name, email, phone, instagram, since, status, client_type, portal_access_id) VALUES
('client_1', 'John & Jane Wedding', 'john.jane@example.com', '081234567893', '@johnjane_wedding', '2024-01-10', 'Aktif', 'Langsung', 'portal_client_1'),
('client_2', 'PT. Maju Bersama', 'info@majubersama.com', '081234567894', '@majubersama_official', '2024-01-15', 'Aktif', 'Vendor', 'portal_client_2'),
('client_3', 'Sarah & David', 'sarah.david@example.com', '081234567895', '@sarahdavid_couple', '2024-01-20', 'Aktif', 'Langsung', 'portal_client_3')
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (
  id, project_name, client_name, client_id, project_type, package_name, package_id,
  add_ons, date, location, progress, status, total_cost, amount_paid, payment_status,
  team, notes
) VALUES
('project_1', 'Wedding John & Jane', 'John & Jane Wedding', 'client_1', 'Pernikahan', 'Paket Gold', 'pkg_2',
 '[{"id": "addon_1", "name": "Drone Photography", "price": 1500000}]'::jsonb,
 '2024-03-15', 'Hotel Grand Indonesia, Jakarta', 75, 'Editing',
 7000000, 3500000, 'DP Terbayar',
 '[{"memberId": "team_1", "name": "Andi Pratama", "role": "Fotografer Utama", "fee": 1500000, "reward": 100000}]'::jsonb,
 'Klien sangat detail, suka foto candid'),
('project_2', 'Corporate Event PT Maju', 'PT. Maju Bersama', 'client_2', 'Corporate', 'Paket Silver', 'pkg_1',
 '[]'::jsonb,
 '2024-02-28', 'Ballroom Hotel Mulia, Jakarta', 100, 'Selesai',
 3500000, 3500000, 'Lunas',
 '[{"memberId": "team_2", "name": "Sari Indah", "role": "Videografer", "fee": 1200000, "reward": 80000}]'::jsonb,
 'Event launching produk baru')
ON CONFLICT (id) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (id, date, description, amount, type, project_id, category, method, card_id) VALUES
('trans_1', '2024-01-10', 'DP Wedding John & Jane', 3500000, 'Pemasukan', 'project_1', 'DP Proyek', 'Transfer Bank', 'card_1'),
('trans_2', '2024-01-15', 'Gaji Andi Pratama - Wedding John & Jane', 1500000, 'Pengeluaran', 'project_1', 'Gaji Freelancer', 'Transfer Bank', 'card_1'),
('trans_3', '2024-02-28', 'Pelunasan Corporate Event PT Maju', 3500000, 'Pemasukan', 'project_2', 'Pelunasan Proyek', 'Transfer Bank', 'card_1'),
('trans_4', '2024-01-20', 'Beli Lensa Baru Canon 85mm', 8500000, 'Pengeluaran', null, 'Peralatan', 'Transfer Bank', 'card_1')
ON CONFLICT (id) DO NOTHING;

-- Insert sample leads
INSERT INTO leads (id, name, contact_channel, location, status, date, notes) VALUES
('lead_1', 'Michael & Lisa', 'Instagram', 'Bandung', 'Sedang Diskusi', '2024-01-25',
 'Tertarik paket Gold untuk wedding di Bandung. Budget sekitar 6-7 juta. Tanggal tentative: Juni 2024.'),
('lead_2', 'CV. Kreatif Nusantara', 'WhatsApp', 'Surabaya', 'Menunggu Follow Up', '2024-01-22',
 'Butuh dokumentasi event launching. Sudah kirim proposal, menunggu konfirmasi.'),
('lead_3', 'Rini & Agus', 'Referensi', 'Jakarta', 'Dikonversi', '2024-01-18',
 'Referensi dari John & Jane. Sudah booking untuk prewedding Maret 2024.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assets
INSERT INTO assets (id, name, category, purchase_date, purchase_price, status, notes) VALUES
('asset_1', 'Canon EOS R5', 'Kamera', '2023-06-15', 65000000, 'Tersedia', 'Kamera utama untuk wedding'),
('asset_2', 'Sony FX3', 'Kamera', '2023-08-20', 45000000, 'Digunakan', 'Untuk videografi'),
('asset_3', 'Godox AD600Pro', 'Lighting', '2023-05-10', 12000000, 'Tersedia', 'Flash studio portable'),
('asset_4', 'MacBook Pro M2', 'Komputer', '2023-09-01', 35000000, 'Digunakan', 'Untuk editing video')
ON CONFLICT (id) DO NOTHING;

-- Insert sample client feedback
INSERT INTO client_feedback (id, client_name, satisfaction, rating, feedback, date) VALUES
('feedback_1', 'John & Jane Wedding', 'Sangat Puas', 5, 'Pelayanan sangat memuaskan! Hasil foto dan video melebihi ekspektasi. Tim sangat profesional dan ramah.', '2024-02-01'),
('feedback_2', 'PT. Maju Bersama', 'Puas', 4, 'Dokumentasi event bagus, namun ada sedikit keterlambatan dalam pengiriman hasil akhir.', '2024-03-05'),
('feedback_3', 'Sarah & David', 'Sangat Puas', 5, 'Amazing work! Foto prewedding kami sangat natural dan indah. Highly recommended!', '2024-02-15')
ON CONFLICT (id) DO NOTHING;

-- Insert sample contracts
INSERT INTO contracts (
  id, contract_number, client_id, project_id, signing_date, signing_location,
  client_name1, client_address1, client_phone1, shooting_duration, guaranteed_photos,
  album_details, digital_files_format, personnel_count, delivery_timeframe,
  cancellation_policy, jurisdiction
) VALUES
('contract_1', 'VP/CTR/2024/001', 'client_1', 'project_1', '2024-01-10', 'Jakarta',
 'John Doe', 'Jl. Sudirman No. 123, Jakarta', '081234567893', '8 jam (10:00 - 18:00)',
 '100 foto edit terbaik', 'Album 20x30 (30 halaman)', 'JPG High-Resolution',
 '2 Fotografer, 1 Videografer', '45 hari kerja',
 'DP yang sudah dibayarkan tidak dapat dikembalikan. Jika pembatalan dilakukan H-7 sebelum hari pelaksanaan, PIHAK KEDUA wajib membayar 50% dari total biaya.',
 'Jakarta')
ON CONFLICT (id) DO NOTHING;

-- Insert sample promo codes
INSERT INTO promo_codes (id, code, discount_type, discount_value, is_active, usage_count, max_usage) VALUES
('promo_1', 'WEDDING2024', 'percentage', 10, true, 2, 50),
('promo_2', 'NEWCLIENT', 'fixed', 500000, true, 5, 100),
('promo_3', 'EARLYBIRD', 'percentage', 15, true, 1, 20)
ON CONFLICT (id) DO NOTHING;

-- Insert sample SOPs
INSERT INTO sops (id, title, category, content) VALUES
('sop_1', 'Persiapan Hari H Wedding', 'Fotografi',
 'CHECKLIST PERSIAPAN HARI H WEDDING

1. H-1 SEBELUM ACARA
   - Cek semua peralatan (kamera, lensa, baterai, memory card)
   - Charge semua baterai hingga 100%
   - Format memory card dan pastikan kapasitas cukup
   - Siapkan backup peralatan
   - Konfirmasi ulang jadwal dan lokasi dengan klien

2. HARI H - PERSIAPAN
   - Datang 30 menit sebelum jadwal
   - Setup peralatan dan test shot
   - Briefing dengan tim dan koordinator acara
   - Pastikan semua angle dan momen penting sudah dipetakan

3. SELAMA ACARA
   - Fokus pada momen-momen penting
   - Ambil foto candid dan formal
   - Koordinasi dengan videografer untuk menghindari blocking
   - Backup foto setiap 2 jam sekali

4. SETELAH ACARA
   - Backup semua file ke storage
   - Buat preview 10-15 foto untuk klien (same day edit)
   - Kirim preview via WhatsApp dalam 24 jam'),
('sop_2', 'Proses Editing Foto Wedding', 'Editing',
 'WORKFLOW EDITING FOTO WEDDING

1. SELEKSI FOTO (Hari 1-3)
   - Import semua foto ke Lightroom
   - Buat koleksi berdasarkan momen (akad, resepsi, dll)
   - Seleksi foto terbaik (ratio 1:10 dari total foto)
   - Hapus foto blur, mata tertutup, atau duplikat

2. COLOR GRADING (Hari 4-7)
   - Tentukan mood/tone sesuai brief klien
   - Buat preset dasar untuk konsistensi
   - Apply color grading ke semua foto terpilih
   - Sesuaikan exposure dan white balance

3. RETOUCHING (Hari 8-14)
   - Bersihkan noda pada wajah dan pakaian
   - Perbaiki pencahayaan yang kurang
   - Crop dan straighten jika diperlukan
   - Jangan over-retouch, pertahankan natural look

4. FINAL REVIEW (Hari 15)
   - Review semua foto sekali lagi
   - Pastikan kualitas konsisten
   - Export dalam resolusi tinggi
   - Siapkan untuk delivery')
ON CONFLICT (id) DO NOTHING;

-- Insert sample social media posts
INSERT INTO social_media_posts (id, project_id, client_name, post_type, platform, scheduled_date, caption, status) VALUES
('social_1', 'project_1', 'John & Jane Wedding', 'Instagram Feed', 'Instagram', '2024-03-20',
 'Behind the scenes dari wedding John & Jane yang magical ✨ Terima kasih sudah mempercayakan momen spesial kalian kepada kami! 📸💕

#VenaPictures #WeddingPhotography #Jakarta #BehindTheScenes #WeddingDay', 'Terjadwal'),
('social_2', 'project_2', 'PT. Maju Bersama', 'Instagram Story', 'Instagram', '2024-03-01',
 'Dokumentasi corporate event PT Maju Bersama kemarin! Sukses selalu untuk launching produk barunya 🚀

#VenaPictures #CorporateEvent #EventPhotography #Jakarta', 'Diposting')
ON CONFLICT (id) DO NOTHING;

-- Insert sample team project payments
INSERT INTO team_project_payments (id, project_id, team_member_name, team_member_id, date, status, fee, reward) VALUES
('payment_1', 'project_1', 'Andi Pratama', 'team_1', '2024-01-15', 'Unpaid', 1500000, 100000),
('payment_2', 'project_2', 'Sari Indah', 'team_2', '2024-02-28', 'Paid', 1200000, 80000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (id, title, message, timestamp, is_read, icon, link) VALUES
('notif_1', 'Proyek Baru Ditambahkan', 'Wedding John & Jane telah ditambahkan ke sistem', '2024-01-10T10:00:00Z', false, 'lead',
 '{"view": "Proyek", "action": {"type": "VIEW_PROJECT_DETAILS", "id": "project_1"}}'::jsonb),
('notif_2', 'Pembayaran DP Diterima', 'DP sebesar Rp 3.500.000 untuk Wedding John & Jane telah diterima', '2024-01-10T14:30:00Z', true, 'payment',
 '{"view": "Keuangan", "action": {"type": "VIEW_TRANSACTION", "id": "trans_1"}}'::jsonb)
ON CONFLICT (id) DO NOTHING;
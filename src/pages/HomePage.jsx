import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import WarningStok from '../components/Dashboard/WarningStok';
import Button from '../components/Common/Button';
import StokMasukModal from '../components/StokFlow/StokMasukModal';
import StokKeluarModal from '../components/StokFlow/StokKeluarModal';
import { reportsAPI, inventoryAPI, stokAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { formatRupiah } from '../utils/formatters';

import {
  IconInventory,
  IconTrendingUp,
  IconAlertTriangle,
  IconMutasi,
  IconArrowDown,
  IconArrowUp
} from '../components/Common/Icons';

export default function HomePage() {
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_barang: 0,
    total_value: 0,
    warning_count: 0,
    monthly_transactions: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [warningItems, setWarningItems] = useState([]);
  const [inventoryList, setInventoryList] = useState([]);

  // Modals state
  const [isMasukOpen, setIsMasukOpen] = useState(false);
  const [isKeluarOpen, setIsKeluarOpen] = useState(false);
  const [selectedItemForRestock, setSelectedItemForRestock] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const [dashRes, invRes] = await Promise.all([
        reportsAPI.getDashboard(),
        inventoryAPI.getAll({ limit: 500 })
      ]);

      const data = dashRes.data;
      setStats({
        total_barang: data.total_barang || 0,
        total_value: data.total_value || 0,
        warning_count: data.warning_count || 0,
        monthly_transactions: data.monthly_transactions || 0
      });
      setRecentTransactions(data.recent_transactions || []);
      setWarningItems(data.warning_items || []);
      setInventoryList(invRes.data?.data || []);
    } catch (err) {
      console.error('Fetch dashboard error:', err);
      notifyError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  }, [notifyError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStokMasukSubmit = async (data) => {
    await stokAPI.masuk(data);
    notifySuccess('Stok masuk berhasil dicatat!');
    fetchDashboardData();
  };

  const handleStokKeluarSubmit = async (data) => {
    await stokAPI.keluar(data);
    notifySuccess('Stok keluar berhasil dicatat!');
    fetchDashboardData();
  };

  const handleQuickRestock = (item) => {
    setSelectedItemForRestock(item);
    setIsMasukOpen(true);
  };

  return (
    <MainLayout title="Dashboard Inventaris">
      {/* Top Banner & Quick Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Ikhtisar Aset & Mutasi
          </h2>
          <p style={{ marginTop: '2px' }}>
            Pantau pergerakan stok barang dan valuasi inventaris real-time sekolah
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            variant="success"
            onClick={() => {
              setSelectedItemForRestock(null);
              setIsMasukOpen(true);
            }}
            icon={<IconArrowDown size={16} />}
          >
            Stok Masuk
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setSelectedItemForRestock(null);
              setIsKeluarOpen(true);
            }}
            icon={<IconArrowUp size={16} />}
          >
            Stok Keluar
          </Button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <StatsCard
          title="Total Jenis Barang"
          value={stats.total_barang}
          subtitle="Item terdaftar di inventaris"
          icon={<IconInventory size={20} />}
          accentColor="#6366F1"
        />

        <StatsCard
          title="Total Nilai Aset Stok"
          value={formatRupiah(stats.total_value)}
          subtitle="Akumulasi valuasi aset aktif"
          icon={<IconTrendingUp size={20} />}
          accentColor="#10B981"
        />

        <StatsCard
          title="Stok Perlu Perhatian"
          value={stats.warning_count}
          subtitle={stats.warning_count > 0 ? 'Segera lakukan pengadaan' : 'Semua stok aman'}
          badge={stats.warning_count > 0 ? 'Perlu Restock' : 'Aman'}
          badgeType={stats.warning_count > 0 ? 'warning' : 'masuk'}
          icon={<IconAlertTriangle size={20} />}
          accentColor="#F59E0B"
        />

        <StatsCard
          title="Mutasi Bulan Ini"
          value={stats.monthly_transactions}
          subtitle="Transaksi masuk & keluar"
          icon={<IconMutasi size={20} />}
          accentColor="#06B6D4"
        />
      </div>

      {/* Main Two-Column Widgets */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px'
        }}
      >
        <div style={{ flex: '2 1 500px' }}>
          <RecentTransactions
            transactions={recentTransactions}
            loading={loading}
          />
        </div>

        <div style={{ flex: '1 1 340px' }}>
          <WarningStok
            items={warningItems}
            onRestock={handleQuickRestock}
          />
        </div>
      </div>

      {/* Modals for Quick Stock In & Out */}
      <StokMasukModal
        isOpen={isMasukOpen}
        onClose={() => {
          setIsMasukOpen(false);
          setSelectedItemForRestock(null);
        }}
        onSubmit={handleStokMasukSubmit}
        items={inventoryList}
        preselectedItem={selectedItemForRestock}
      />

      <StokKeluarModal
        isOpen={isKeluarOpen}
        onClose={() => setIsKeluarOpen(false)}
        onSubmit={handleStokKeluarSubmit}
        items={inventoryList}
      />
    </MainLayout>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import InventoryTable from '../components/Inventory/InventoryTable';
import InventoryForm from '../components/Inventory/InventoryForm';
import DeleteConfirm from '../components/Inventory/DeleteConfirm';
import SearchFilter from '../components/Inventory/SearchFilter';
import Button from '../components/Common/Button';
import StokMasukModal from '../components/StokFlow/StokMasukModal';
import StokKeluarModal from '../components/StokFlow/StokKeluarModal';
import { inventoryAPI, stokAPI } from '../services/api';
import { useNotification } from '../hooks/useNotification';
import { IconPlus } from '../components/Common/Icons';

export default function InventoryPage() {
  const { notifySuccess, notifyError } = useNotification();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Quick Stock Modals
  const [isMasukOpen, setIsMasukOpen] = useState(false);
  const [isKeluarOpen, setIsKeluarOpen] = useState(false);
  const [targetItemForStok, setTargetItemForStok] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await inventoryAPI.getCategories();
      setCategories(res.data?.data || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  }, []);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await inventoryAPI.getAll({
        search: search || undefined,
        kategori: category || undefined,
        page,
        limit: 50
      });
      setItems(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotalItems(res.data?.total || 0);
    } catch (err) {
      console.error('Fetch inventory error:', err);
      notifyError('Gagal memuat data inventaris barang');
    } finally {
      setLoading(false);
    }
  }, [search, category, page, notifyError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Handle Form Submit (Add/Edit)
  const handleFormSubmit = async (formData) => {
    if (editingItem) {
      await inventoryAPI.update(editingItem.id, formData);
      notifySuccess(`Barang "${formData.nama_barang}" berhasil diperbarui!`);
    } else {
      await inventoryAPI.create(formData);
      notifySuccess(`Barang "${formData.nama_barang}" berhasil ditambahkan!`);
    }
    fetchInventory();
    fetchCategories();
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setDeleteLoading(true);
    try {
      await inventoryAPI.delete(deletingItem.id);
      notifySuccess(`Barang "${deletingItem.nama_barang}" berhasil dihapus.`);
      setIsDeleteOpen(false);
      setDeletingItem(null);
      fetchInventory();
    } catch (err) {
      notifyError(err.response?.data?.error || 'Gagal menghapus barang.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Quick Stock In/Out
  const handleStokMasukSubmit = async (data) => {
    await stokAPI.masuk(data);
    notifySuccess('Stok masuk berhasil dicatat!');
    fetchInventory();
  };

  const handleStokKeluarSubmit = async (data) => {
    await stokAPI.keluar(data);
    notifySuccess('Stok keluar berhasil dicatat!');
    fetchInventory();
  };

  return (
    <MainLayout title="Inventaris Barang">
      {/* Top Header & Add Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h2>Master Data Barang</h2>
          <p>Kelola seluruh daftar aset dan peralatan sekolah ({totalItems} barang)</p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          icon={<IconPlus size={16} />}
        >
          Tambah Barang Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <SearchFilter
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        category={category}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
        categories={categories}
      />

      {/* Inventory Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <InventoryTable
          data={items}
          loading={loading}
          onEdit={(item) => {
            setEditingItem(item);
            setIsFormOpen(true);
          }}
          onDelete={(item) => {
            setDeletingItem(item);
            setIsDeleteOpen(true);
          }}
          onStokMasuk={(item) => {
            setTargetItemForStok(item);
            setIsMasukOpen(true);
          }}
          onStokKeluar={(item) => {
            setTargetItemForStok(item);
            setIsKeluarOpen(true);
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <span>
              Halaman {page} dari {totalPages} ({totalItems} item)
            </span>
            <div className="pagination-controls">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ‹ Sebelumnya
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Berikutnya ›
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirm
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={deletingItem?.nama_barang}
        loading={deleteLoading}
      />

      {/* Quick Stok Modals */}
      <StokMasukModal
        isOpen={isMasukOpen}
        onClose={() => {
          setIsMasukOpen(false);
          setTargetItemForStok(null);
        }}
        onSubmit={handleStokMasukSubmit}
        items={items}
        preselectedItem={targetItemForStok}
      />

      <StokKeluarModal
        isOpen={isKeluarOpen}
        onClose={() => {
          setIsKeluarOpen(false);
          setTargetItemForStok(null);
        }}
        onSubmit={handleStokKeluarSubmit}
        items={items}
        preselectedItem={targetItemForStok}
      />
    </MainLayout>
  );
}

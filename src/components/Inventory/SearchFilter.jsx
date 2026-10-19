import React from 'react';
import Input from '../Common/Input';
import Select from '../Common/Select';

export default function SearchFilter({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = []
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '20px'
      }}
    >
      <div style={{ flex: '1 1 280px' }}>
        <Input
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mb-0"
        />
      </div>
      <div style={{ width: '220px' }}>
        <Select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          options={categories.map((c) => ({ value: c, label: c }))}
          placeholder="Semua Kategori"
          className="mb-0"
        />
      </div>
    </div>
  );
}

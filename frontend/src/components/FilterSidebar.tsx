'use client';

import React from 'react';
import { FilterOptions } from '@/types/marketplace';
import { Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onChange: (updated: Partial<FilterOptions>) => void;
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, onReset }) => {
  const categories = ['All', 'Books', 'Electronics', 'Furniture', 'Stationery', 'Other'];
  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];
  const listingTypes = ['All', 'For Sale', 'Free', 'Exchange'];

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                filters.category === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Listing Type
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {listingTypes.map((type) => (
            <button
              key={type}
              onClick={() => onChange({ listingType: type })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-center border transition ${
                filters.listingType === type
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Condition
        </label>
        <select
          value={filters.condition}
          onChange={(e) => onChange({ condition: e.target.value })}
          className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {conditions.map((cond) => (
            <option key={cond} value={cond}>
              {cond === 'All' ? 'Any Condition' : cond}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Max Price (₹)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="No Limit"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full text-xs border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Hostel / Zone
        </label>
        <input
          type="text"
          placeholder="e.g. Block A, Library"
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="w-full text-xs border border-slate-300 rounded-lg p-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </aside>
  );
};

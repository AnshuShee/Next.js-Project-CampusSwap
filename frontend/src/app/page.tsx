'use client';

import React, { useEffect, useState } from 'react';
import { Listing, FilterOptions } from '@/types/marketplace';
import { listingService } from '@/services/api';
import { ListingCard } from '@/components/ListingCard';
import { FilterSidebar } from '@/components/FilterSidebar';
import { Search, ArrowUpDown, Sparkles, Loader2 } from 'lucide-react';

export default function MarketplaceHome() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    condition: 'All',
    listingType: 'All',
    location: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await listingService.getListings(filters);
      if (res.data.success) {
        setListings(res.data.listings);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 250);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleFilterChange = (updated: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      condition: 'All',
      listingType: 'All',
      location: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
    });
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-8 text-white shadow-lg overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Zero Brokerage • Verified Campus Students Only</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Buy, Sell & Exchange Semester Gear
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base">
            Trade drafters, textbooks, calculators and hostel room essentials with students in your own campus.
          </p>

          <div className="mt-6 flex items-center bg-white rounded-2xl p-1.5 shadow-xl">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              placeholder="Search books, drafters, scientific calculators, hostels..."
              value={filters.search}
              onChange={(e) => handleFilterChange({ search: e.target.value })}
              className="w-full px-3 py-2 text-slate-800 text-sm bg-transparent focus:outline-none"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange({ search: '' })}
                className="text-xs text-slate-400 hover:text-slate-600 mr-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSidebar
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <span className="text-xs font-semibold text-slate-600">
              Showing <span className="font-bold text-slate-900">{listings.length}</span> active student listings
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange({ sort: e.target.value })}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="relevance">Relevance</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs font-semibold">Loading campus items...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No matching items found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing filters, or searching for broader terms like "calculator" or "book".
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-indigo-700 transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {listings.map((item) => (
                <ListingCard key={item._id} listing={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

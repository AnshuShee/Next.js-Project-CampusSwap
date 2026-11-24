'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ListingCategory, ItemCondition, ListingType } from '@/types/marketplace';
import { listingService } from '@/services/api';
import { compressImage } from '@/utils/imageCompressor';
import { suggestCategory, generateDescription } from '@/utils/smartHelpers';
import {
  Upload,
  Sparkles,
  FileText,
  X,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export default function SellPage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [category, setCategory] = useState<ListingCategory>('Books');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [listingType, setListingType] = useState<ListingType>('For Sale');
  const [exchangePreference, setExchangePreference] = useState('');
  const [location, setLocation] = useState('Hostel Block A');
  const [images, setImages] = useState<string[]>([]);

  const [compressing, setCompressing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    try {
      setCompressing(true);
      const compressedList: string[] = [];

      for (const file of files) {
        const compressedBase64 = await compressImage(file, 800, 0.7);
        compressedList.push(compressedBase64);
      }

      setImages((prev) => [...prev, ...compressedList].slice(0, 4));
    } catch (err) {
      console.error('Image compression failed:', err);
      setError('Could not process image. Try a standard JPEG or PNG.');
    } finally {
      setCompressing(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAutoSuggestCategory = () => {
    const suggested = suggestCategory(title, description);
    setCategory(suggested);
  };

  const handleGenerateDescription = () => {
    const template = generateDescription(title, category, condition, listingType);
    setDescription(template);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please provide a title and item description.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await listingService.createListing({
        title,
        description,
        price: listingType === 'For Sale' ? Number(price) : 0,
        category,
        condition,
        listingType,
        exchangePreference,
        location,
        images,
      });

      if (res.data.success) {
        router.push(`/listings/${res.data.listing._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error publishing listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          List an Item on CampusSwap
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Reach hundreds of college students living in your hostels and nearby campus zones.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Item Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Casio fx-991ES Plus Scientific Calculator or B.S. Grewal Maths"
            className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Category *
            </label>
            <button
              type="button"
              onClick={handleAutoSuggestCategory}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Auto-Suggest Category</span>
            </button>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory)}
            className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Stationery">Stationery</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Condition *
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as ItemCondition)}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="New">New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Listing Type *
            </label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value as ListingType)}
              className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="For Sale">For Sale (Priced in ₹)</option>
              <option value="Free">Free (Semester Giveaway)</option>
              <option value="Exchange">Exchange (Barter trade)</option>
            </select>
          </div>
        </div>

        {listingType === 'For Sale' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Price (₹ INR) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {listingType === 'Exchange' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              What do you want in exchange? *
            </label>
            <input
              type="text"
              required
              value={exchangePreference}
              onChange={(e) => setExchangePreference(e.target.value)}
              placeholder="e.g. Engineering Graphics drafter or laptop cooling pad"
              className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Description *
            </label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              <FileText className="w-3 h-3 text-indigo-600" />
              <span>Generate Description Template</span>
            </button>
          </div>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mention purchase year, condition, semester usage, or what you want in exchange..."
            className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-normal"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Hostel / Campus Pickup Zone *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Boys Hostel Block A, Main Campus Library, Day Scholar Gate"
            className="w-full p-3 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Photos (Up to 4 compressed images)
          </label>
          <div className="mt-1 flex flex-wrap gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-slate-900/70 text-white rounded-full hover:bg-rose-600 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-indigo-50/30 transition text-slate-500">
                <Upload className="w-5 h-5 mb-1 text-slate-400" />
                <span className="text-[10px] font-bold">Add Photo</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {compressing && (
            <p className="text-[11px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Compressing client-side...
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || compressing}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publishing to Campus Marketplace...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

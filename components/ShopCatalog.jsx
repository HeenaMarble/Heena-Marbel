"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategorySelector from '@/components/CategorySelector';
import ShopGrid from '@/components/ShopGrid';
import styles from '@/components/ShopToolbar.module.css';

const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: null, max: null },
  { id: 'under-5k', label: 'Under ₹5,000', min: 0, max: 5000 },
  { id: '5k-15k', label: '₹5,000 – ₹15,000', min: 5000, max: 15000 },
  { id: '15k-30k', label: '₹15,000 – ₹30,000', min: 15000, max: 30000 },
  { id: '30k-50k', label: '₹30,000 – ₹50,000', min: 30000, max: 50000 },
  { id: 'above-50k', label: '₹50,000 & Above', min: 50000, max: null },
];

const SORT_OPTIONS = [
  { id: 'newest', label: '✨ New Arrivals' },
  { id: 'featured', label: '🔥 Featured' },
  { id: 'price-low', label: '💰 Price: Low to High' },
  { id: 'price-high', label: '💎 Price: High to Low' },
  { id: 'name-asc', label: '🔤 Name: A to Z' },
];

export default function ShopCatalog({ initialProducts, categories, initialCategorySlug }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategorySlug || null);
  const [selectedPricePreset, setSelectedPricePreset] = useState('all');
  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');
  const [activePriceFilter, setActivePriceFilter] = useState({ min: null, max: null, label: null });
  const [sortBy, setSortBy] = useState('newest');
  const [openDropdown, setOpenDropdown] = useState(null); // 'category' | 'price' | 'sort' | null

  const toolbarRef = useRef(null);

  // Sync category with URL on direct load or external navigation
  useEffect(() => {
    const cat = searchParams.get('category') || null;
    setSelectedCategory(cat);
  }, [searchParams]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update URL without full refresh
  const updateCategoryUrl = (slug) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    const newUrl = params.toString() ? `/shop?${params.toString()}` : '/shop';
    window.history.replaceState({}, '', newUrl);
  };

  const handlePricePresetSelect = (preset) => {
    setSelectedPricePreset(preset.id);
    if (preset.id === 'all') {
      setActivePriceFilter({ min: null, max: null, label: null });
    } else {
      setActivePriceFilter({ min: preset.min, max: preset.max, label: preset.label });
    }
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setOpenDropdown(null);
  };

  const handleCustomPriceApply = (e) => {
    e.preventDefault();
    const min = customMinPrice ? parseFloat(customMinPrice) : null;
    const max = customMaxPrice ? parseFloat(customMaxPrice) : null;

    if (min === null && max === null) {
      setActivePriceFilter({ min: null, max: null, label: null });
      setSelectedPricePreset('all');
    } else {
      let label = '';
      if (min !== null && max !== null) label = `₹${min.toLocaleString('en-IN')} – ₹${max.toLocaleString('en-IN')}`;
      else if (min !== null) label = `Above ₹${min.toLocaleString('en-IN')}`;
      else if (max !== null) label = `Under ₹${max.toLocaleString('en-IN')}`;

      setActivePriceFilter({ min, max, label });
      setSelectedPricePreset('custom');
    }
    setOpenDropdown(null);
  };

  const clearAllFilters = () => {
    updateCategoryUrl(null);
    setSelectedPricePreset('all');
    setActivePriceFilter({ min: null, max: null, label: null });
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setSortBy('newest');
    setOpenDropdown(null);
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...(initialProducts || [])];

    // 1. Category Filter
    if (selectedCategory) {
      list = list.filter((p) => p.category_slug === selectedCategory);
    }

    // 2. Price Filter
    if (activePriceFilter.min !== null || activePriceFilter.max !== null) {
      list = list.filter((p) => {
        const price = Number(p.price) || 0;
        if (activePriceFilter.min !== null && price < activePriceFilter.min) return false;
        if (activePriceFilter.max !== null && price > activePriceFilter.max) return false;
        return true;
      });
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === 'featured') {
        return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
      }
      if (sortBy === 'price-low') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortBy === 'price-high') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      if (sortBy === 'name-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    return list;
  }, [initialProducts, selectedCategory, activePriceFilter, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const activeSortObj = SORT_OPTIONS.find((s) => s.id === sortBy);
  const hasActiveFilters = !!selectedCategory || !!activePriceFilter.label || sortBy !== 'newest';

  return (
    <>
      {/* Category story/circle selector */}
      <CategorySelector
        categories={categories}
        activeSlug={selectedCategory}
        onSelectCategory={updateCategoryUrl}
      />

      {/* Horizontal Toolbar */}
      <div className={styles.toolbarWrapper} ref={toolbarRef}>
        <div className={styles.toolbar}>
          {/* Left: Product count */}
          <div className={styles.infoCol}>
            <span className={styles.productCount}>
              Showing <span className={styles.countHighlight}>{filteredProducts.length}</span> of {initialProducts.length} Products
            </span>
          </div>

          {/* Right: Filter & Sort Controls */}
          <div className={styles.controlsCol}>
            {/* 1. Category Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                type="button"
                className={`${styles.dropdownTrigger} ${selectedCategory ? styles.activeTrigger : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                aria-expanded={openDropdown === 'category'}
              >
                <svg className={styles.triggerIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>{activeCategoryObj ? activeCategoryObj.name : 'Category'}</span>
                {selectedCategory && <span className={styles.activeIndicator} />}
                <svg className={`${styles.chevron} ${openDropdown === 'category' ? styles.chevronOpen : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {openDropdown === 'category' && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.menuHeader}>Filter by Category</div>
                  <div className={styles.menuList}>
                    <button
                      type="button"
                      className={`${styles.menuItem} ${!selectedCategory ? styles.selectedItem : ''}`}
                      onClick={() => {
                        updateCategoryUrl(null);
                        setOpenDropdown(null);
                      }}
                    >
                      <span>All Products</span>
                      {!selectedCategory && (
                        <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`${styles.menuItem} ${selectedCategory === c.slug ? styles.selectedItem : ''}`}
                        onClick={() => {
                          updateCategoryUrl(c.slug);
                          setOpenDropdown(null);
                        }}
                      >
                        <span>{c.name}</span>
                        {selectedCategory === c.slug && (
                          <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Price Filter Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                type="button"
                className={`${styles.dropdownTrigger} ${activePriceFilter.label ? styles.activeTrigger : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
                aria-expanded={openDropdown === 'price'}
              >
                <svg className={styles.triggerIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                <span>{activePriceFilter.label ? activePriceFilter.label : 'Price Filter'}</span>
                {activePriceFilter.label && <span className={styles.activeIndicator} />}
                <svg className={`${styles.chevron} ${openDropdown === 'price' ? styles.chevronOpen : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {openDropdown === 'price' && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.menuHeader}>Price Range</div>
                  <div className={styles.menuList}>
                    {PRICE_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`${styles.menuItem} ${selectedPricePreset === p.id ? styles.selectedItem : ''}`}
                        onClick={() => handlePricePresetSelect(p)}
                      >
                        <span>{p.label}</span>
                        {selectedPricePreset === p.id && (
                          <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Custom Price Inputs */}
                  <form className={styles.priceCustomForm} onSubmit={handleCustomPriceApply}>
                    <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600 }}>Custom Range (₹):</div>
                    <div className={styles.priceInputRow}>
                      <input
                        type="number"
                        placeholder="Min"
                        className={styles.priceInput}
                        value={customMinPrice}
                        onChange={(e) => setCustomMinPrice(e.target.value)}
                        min="0"
                      />
                      <span style={{ color: '#aaa', fontSize: '0.75rem' }}>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className={styles.priceInput}
                        value={customMaxPrice}
                        onChange={(e) => setCustomMaxPrice(e.target.value)}
                        min="0"
                      />
                    </div>
                    <button type="submit" className={styles.applyBtn}>
                      Apply Price
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* 3. New Products / Sort Dropdown */}
            <div className={styles.dropdownContainer}>
              <button
                type="button"
                className={`${styles.dropdownTrigger} ${sortBy !== 'newest' ? styles.activeTrigger : ''}`}
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                aria-expanded={openDropdown === 'sort'}
              >
                <svg className={styles.triggerIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10"></line>
                  <line x1="21" y1="6" x2="3" y2="6"></line>
                  <line x1="21" y1="14" x2="3" y2="14"></line>
                  <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
                <span>{activeSortObj ? activeSortObj.label : 'Sort by'}</span>
                <svg className={`${styles.chevron} ${openDropdown === 'sort' ? styles.chevronOpen : ''}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {openDropdown === 'sort' && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.menuHeader}>Sort Products</div>
                  <div className={styles.menuList}>
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`${styles.menuItem} ${sortBy === s.id ? styles.selectedItem : ''}`}
                        onClick={() => {
                          setSortBy(s.id);
                          setOpenDropdown(null);
                        }}
                      >
                        <span>{s.label}</span>
                        {sortBy === s.id && (
                          <svg className={styles.checkIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Filter Badges Strip */}
        {hasActiveFilters && (
          <div className={styles.activeTagsRow}>
            <span className={styles.activeTagLabel}>Active Filters:</span>
            
            {selectedCategory && (
              <span className={styles.tagPill}>
                Category: <strong>{activeCategoryObj?.name || selectedCategory}</strong>
                <button
                  type="button"
                  className={styles.tagRemoveBtn}
                  onClick={() => updateCategoryUrl(null)}
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}

            {activePriceFilter.label && (
              <span className={styles.tagPill}>
                Price: <strong>{activePriceFilter.label}</strong>
                <button
                  type="button"
                  className={styles.tagRemoveBtn}
                  onClick={() => handlePricePresetSelect(PRICE_PRESETS[0])}
                  aria-label="Remove price filter"
                >
                  ✕
                </button>
              </span>
            )}

            {sortBy !== 'newest' && (
              <span className={styles.tagPill}>
                Sort: <strong>{activeSortObj?.label}</strong>
                <button
                  type="button"
                  className={styles.tagRemoveBtn}
                  onClick={() => setSortBy('newest')}
                  aria-label="Reset sort"
                >
                  ✕
                </button>
              </span>
            )}

            <button type="button" className={styles.clearAllBtn} onClick={clearAllFilters}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <ShopGrid products={filteredProducts} />
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateTitle}>No products found</div>
          <p className={styles.emptyStateDesc}>
            No products match your selected category or price range. Try adjusting your filters.
          </p>
          <button type="button" className={styles.resetFiltersBtn} onClick={clearAllFilters}>
            Reset All Filters
          </button>
        </div>
      )}
    </>
  );
}

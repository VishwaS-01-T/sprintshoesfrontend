import React, { useState, useEffect } from 'react';
import {
  Check,
  Pencil,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Trash2,
  Home,
  Briefcase,
} from 'lucide-react';
import { Link, useRouter } from '../hooks/useRouter.jsx';
import useCartStore from '../store/cartStore';

// ─── Checkout Stepper ────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Sign Up', status: 'done' },
  { id: 2, label: 'Address', status: 'active' },
  { id: 3, label: 'Payment', status: 'upcoming' },
];

const Stepper = () => (
  <div className="flex items-center justify-center py-5 border-b border-neutral-100">
    {STEPS.map((step, index) => (
      <React.Fragment key={step.id}>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              step.status === 'done' || step.status === 'active'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-200 text-neutral-500'
            }`}
          >
            {step.status === 'done' ? (
              <Check className="w-4 h-4" />
            ) : step.status === 'active' ? (
              <Pencil className="w-3.5 h-3.5" />
            ) : (
              step.id
            )}
          </div>
          <span
            className={`text-sm font-semibold hidden sm:block ${
              step.status === 'upcoming' ? 'text-neutral-400' : 'text-neutral-900'
            }`}
          >
            {step.label}
          </span>
        </div>
        {index < STEPS.length - 1 && (
          <div
            className={`h-px w-12 sm:w-20 mx-3 shrink-0 ${
              step.status === 'done' ? 'bg-neutral-900' : 'bg-neutral-200'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Address Form Modal ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  phone: '',
  pincode: '',
  address: '',
  landmark: '',
  city: '',
  state: '',
  type: 'HOME',
};

const AddressFormModal = ({ onClose, onSave, initial }) => {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit number';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white rounded-t-3xl sm:rounded-t-2xl">
          <h3 className="text-lg font-bold text-neutral-900">
            {initial ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="John Doe"
                className={`w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.name ? 'border-rose-400' : 'border-neutral-200'}`}
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="10-digit number"
                maxLength={10}
                className={`w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.phone ? 'border-rose-400' : 'border-neutral-200'}`}
              />
              {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Pincode + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">Pincode</label>
              <input
                value={form.pincode}
                onChange={(e) => update('pincode', e.target.value)}
                placeholder="6-digit pincode"
                maxLength={6}
                className={`w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.pincode ? 'border-rose-400' : 'border-neutral-200'}`}
              />
              {errors.pincode && <p className="text-xs text-rose-500 mt-1">{errors.pincode}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">City</label>
              <input
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Mumbai"
                className={`w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.city ? 'border-rose-400' : 'border-neutral-200'}`}
              />
              {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
              House / Flat / Block, Street, Area
            </label>
            <textarea
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="123, Park Street, Bandra West"
              rows={2}
              className={`w-full px-3.5 py-3 text-sm border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.address ? 'border-rose-400' : 'border-neutral-200'}`}
            />
            {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
          </div>

          {/* Landmark + State */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">
                Landmark <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <input
                value={form.landmark}
                onChange={(e) => update('landmark', e.target.value)}
                placeholder="Near metro station"
                className="w-full px-3.5 py-3 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-neutral-600 mb-1.5 block">State</label>
              <input
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                placeholder="Maharashtra"
                className={`w-full px-3.5 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${errors.state ? 'border-rose-400' : 'border-neutral-200'}`}
              />
              {errors.state && <p className="text-xs text-rose-500 mt-1">{errors.state}</p>}
            </div>
          </div>

          {/* Address Type */}
          <div>
            <label className="text-xs font-semibold text-neutral-600 mb-2 block">Address Type</label>
            <div className="flex gap-3">
              {['HOME', 'WORK', 'OTHER'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => update('type', t)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                    form.type === t
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {t === 'HOME' && <Home className="w-3.5 h-3.5" />}
                  {t === 'WORK' && <Briefcase className="w-3.5 h-3.5" />}
                  {t === 'OTHER' && <MapPin className="w-3.5 h-3.5" />}
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSave}
            className="w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-700 active:scale-[0.98] transition-all"
          >
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Address Card ─────────────────────────────────────────────────────────────
const AddressCard = ({ address, selected, onSelect, onEdit, onDelete }) => (
  <div
    onClick={onSelect}
    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
      selected
        ? 'border-neutral-900 bg-neutral-50'
        : 'border-neutral-200 bg-white hover:border-neutral-400'
    }`}
  >
    {/* Selection dot */}
    <div
      className={`absolute top-5 right-5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
      }`}
    >
      {selected && <Check className="w-3 h-3 text-white" />}
    </div>

    {/* Type badge */}
    <div className="flex items-center gap-1.5 mb-3">
      {address.type === 'HOME' && <Home className="w-3.5 h-3.5 text-neutral-500" />}
      {address.type === 'WORK' && <Briefcase className="w-3.5 h-3.5 text-neutral-500" />}
      {address.type === 'OTHER' && <MapPin className="w-3.5 h-3.5 text-neutral-500" />}
      <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">{address.type}</span>
    </div>

    <p className="font-bold text-neutral-900 text-sm">{address.name}</p>
    <p className="text-sm text-neutral-600 mt-0.5">{address.address}</p>
    {address.landmark && (
      <p className="text-sm text-neutral-500">Near {address.landmark}</p>
    )}
    <p className="text-sm text-neutral-600">
      {address.city}, {address.state} — {address.pincode}
    </p>
    <p className="text-sm text-neutral-500 mt-0.5">+91 {address.phone}</p>

    {/* Actions */}
    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(); }}
        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-amber-600 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-rose-500 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" /> Remove
      </button>
    </div>
  </div>
);

// ─── Right Panel — Order Summary ──────────────────────────────────────────────
const OrderSummaryPanel = () => {
  const items = useCartStore((s) => s.items);
  const getCartSummary = useCartStore((s) => s.getCartSummary);
  const { subtotal, shipping, total, itemCount } = getCartSummary();

  const [bagOpen, setBagOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Bag Section */}
      <button
        onClick={() => setBagOpen((v) => !v)}
        className="flex items-center justify-between w-full px-5 py-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-900">Bag</span>
          <span className="text-sm text-neutral-500">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
        </div>
        {bagOpen ? (
          <ChevronUp className="w-5 h-5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>

      {bagOpen && (
        <div className="border-t border-neutral-100 divide-y divide-neutral-100">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-3">
              <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{item.name}</p>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Size {item.size}{item.color && ` · ${item.color}`} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-neutral-900 shrink-0">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-neutral-100" />

      {/* Price Details Section */}
      <button
        onClick={() => setPriceOpen((v) => !v)}
        className="flex items-center justify-between w-full px-5 py-4 hover:bg-neutral-50 transition-colors"
      >
        <span className="font-bold text-neutral-900">Price Details</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-600">
            ₹{total.toLocaleString('en-IN')}
          </span>
          {priceOpen ? (
            <ChevronUp className="w-5 h-5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-400" />
          )}
        </div>
      </button>

      {priceOpen && (
        <div className="border-t border-neutral-100 px-5 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Bag Total</span>
            <span className="font-medium text-neutral-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-600">Shipping</span>
            <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-neutral-900'}`}>
              {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
            </span>
          </div>
          <div className="border-t border-neutral-100 pt-3 flex justify-between">
            <span className="font-bold text-neutral-900">You Pay</span>
            <span className="font-bold text-neutral-900">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main AddressPage ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'sprint-shoes-addresses';

const AddressPage = () => {
  const { navigate } = useRouter();
  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });
  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  // Auto-select first address
  useEffect(() => {
    if (addresses.length > 0 && !selectedId) {
      setSelectedId(addresses[0].id);
    }
  }, [addresses, selectedId]);

  const handleSave = (form) => {
    if (editingAddress) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddress.id ? { ...form, id: editingAddress.id } : a))
      );
    } else {
      const newAddr = { ...form, id: `addr-${Date.now()}` };
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedId(newAddr.id);
    }
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  return (
    <>
      {/* Stepper — fixed top bar */}
      <div className="bg-white sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Stepper />
        </div>
      </div>

      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900">Choose Address</h1>
            <p className="text-sm text-neutral-500 mt-1">
              Detailed address will help our delivery partner reach your doorstep quickly
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left: Address Cards ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Add New Address card */}
              <button
                onClick={() => { setEditingAddress(null); setShowForm(true); }}
                className="w-full flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-neutral-300 bg-white hover:border-amber-400 hover:bg-amber-50/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-full border-2 border-neutral-300 group-hover:border-amber-500 flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <span className="font-bold text-neutral-600 group-hover:text-amber-600 transition-colors">
                  Add New Address
                </span>
              </button>

              {/* Saved addresses */}
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selected={selectedId === address.id}
                  onSelect={() => setSelectedId(address.id)}
                  onEdit={() => handleEdit(address)}
                  onDelete={() => handleDelete(address.id)}
                />
              ))}

              {/* Proceed CTA (mobile) */}
              {addresses.length > 0 && (
                <button
                  onClick={() => navigate('/checkout/payment')}
                  disabled={!selectedId}
                  className="w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all lg:hidden"
                >
                  Deliver Here
                </button>
              )}
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="lg:col-span-1 space-y-4">
              <OrderSummaryPanel />

              {/* Proceed CTA (desktop) */}
              {addresses.length > 0 && (
                <button
                  onClick={() => navigate('/checkout/payment')}
                  disabled={!selectedId}
                  className="w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-700 disabled:bg-neutral-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all hidden lg:block"
                >
                  Deliver Here
                </button>
              )}

              {/* Back to bag */}
              <Link
                href="/cart"
                className="flex items-center justify-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors py-2"
              >
                ← Back to Bag
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Address form modal */}
      {showForm && (
        <AddressFormModal
          initial={editingAddress}
          onClose={() => { setShowForm(false); setEditingAddress(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default AddressPage;

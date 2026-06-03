"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { asArray } from "@/types/api";
import { ApiCategory, ApiProduct } from "@/types/productApi";
import { addProductImage, createProduct, deleteProduct, getAdminCategories, getAdminProducts, updateProduct } from "@/lib/api/products";
import { getFilterGroups } from "@/lib/api/filters";
import { uploadMedia } from "@/lib/api/media";
import { ApiFilterGroup } from "@/types/filter";
import { useEditMode } from "./EditModeProvider";

type ProductForm = {
  id?: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  discounted_price: string;
  stock: string;
  category: string;
  image_url: string;
  image_file?: File | null;
  filters: string[];
  is_featured: boolean;
  is_active: boolean;
};

const emptyForm: ProductForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  discounted_price: "",
  stock: "0",
  category: "",
  image_url: "",
  image_file: null,
  filters: [],
  is_featured: false,
  is_active: true,
};

const flattenCategories = (categories: ApiCategory[], depth = 0): Array<ApiCategory & { depth: number }> =>
  categories.flatMap((category) => [{ ...category, depth }, ...flattenCategories(category.children ?? [], depth + 1)]);

const toPayload = (form: ProductForm) => ({
  title: form.title,
  slug: form.slug,
  description: form.description,
  price: form.price || "0",
  discounted_price: form.discounted_price || null,
  stock: Number(form.stock || 0),
  category: form.category ? Number(form.category) : null,
  filters: form.filters.map(Number),
  is_featured: form.is_featured,
  is_active: form.is_active,
});

const saveProductImage = async (productId: number, form: ProductForm) => {
  if (form.image_file) {
    const media = await uploadMedia(form.image_file, { alt_text: form.title });
    await addProductImage(productId, { media: media.id, image: media.file_url || media.file, image_type: "preview" });
    return;
  }
  if (form.image_url) {
    await addProductImage(productId, { image: form.image_url, alt_text: form.title, image_type: "preview" });
  }
};

export default function AdminProductsPanel() {
  const { isAdmin } = useEditMode();
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [filterGroups, setFilterGroups] = useState<ApiFilterGroup[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [many, setMany] = useState<ProductForm[]>([{ ...emptyForm }]);
  const [mode, setMode] = useState<"single" | "many">("single");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || String(product.category ?? "") === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const load = async () => {
    const [productData, categoryData, filterData] = await Promise.all([
      getAdminProducts().catch(() => ({ results: [] })),
      getAdminCategories().catch(() => ({ results: [] })),
      getFilterGroups().catch(() => ({ results: [] })),
    ]);
    setProducts(asArray(productData));
    setCategories(asArray(categoryData));
    setFilterGroups(asArray(filterData));
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const saveSingle = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = form.id ? await updateProduct(form.id, toPayload(form)) : await createProduct(toPayload(form));
      await saveProductImage(saved.id, form);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
    } finally {
      setSaving(false);
    }
  };

  const saveMany = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await Promise.all(many.filter((item) => item.title.trim()).map(async (item) => {
        const saved = await createProduct(toPayload(item));
        await saveProductImage(saved.id, item);
      }));
      setMany([{ ...emptyForm }]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save products.");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product: ApiProduct) => {
    setMode("single");
    setForm({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      price: String(product.price ?? ""),
      discounted_price: String(product.discounted_price ?? ""),
      stock: String(product.stock ?? 0),
      category: product.category ? String(product.category) : "",
      image_url: product.images?.[0]?.media_detail?.file_url || product.images?.[0]?.image || "",
      image_file: null,
      filters: (product.filters_detail ?? []).map((filter) => String(filter.id)),
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
  };

  const categorySelect = (value: string, onChange: (value: string) => void) => (
    <select className="w-full rounded border border-gray-3 px-3 py-2 outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">No category</option>
      {flatCategories.map((category) => <option key={category.id} value={category.id}>{"- ".repeat(category.depth)}{category.title}</option>)}
    </select>
  );

  if (!isAdmin) return <div className="py-20 text-center text-dark">Admin access required.</div>;

  return (
    <section className="overflow-hidden bg-[#f3f4f6] py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-7.5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-semibold text-xl xl:text-heading-5 text-dark">View All Products</h1>
          <a href="/admin/categories" className="rounded-[5px] bg-gray-2 px-4 py-2 text-custom-sm font-medium text-dark">Manage Categories</a>
        </div>

        <div className="mb-7.5 rounded-lg bg-white p-5 shadow-1">
          <div className="mb-4 flex flex-wrap gap-3">
            <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Search products" value={search} onChange={(event) => setSearch(event.target.value)} />
            {categorySelect(categoryFilter, setCategoryFilter)}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-custom-sm">
              <thead><tr className="border-b border-gray-3 text-dark"><th className="py-3">Image</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Active</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-3">
                    <td className="py-3"><div className="h-12 w-12 rounded bg-gray-1 bg-cover bg-center" style={{ backgroundImage: `url(${product.images?.[0]?.media_detail?.file_url || product.images?.[0]?.image || ""})` }} /></td>
                    <td className="font-medium text-dark">{product.title}</td>
                    <td>{product.category_detail?.title || "-"}</td>
                    <td>${product.discounted_price || product.price}</td>
                    <td>{product.stock}</td>
                    <td>{product.is_featured ? "Yes" : "No"}</td>
                    <td>{product.is_active ? "Yes" : "No"}</td>
                    <td className="flex gap-2 py-3">
                      <button type="button" className="rounded bg-gray-1 px-3 py-1 text-custom-xs text-dark" onClick={() => editProduct(product)}>Edit</button>
                      <a className="rounded bg-gray-1 px-3 py-1 text-custom-xs text-dark" href={`/shop-details/${product.slug}`}>View</a>
                      <button type="button" className="rounded bg-red-light-6 px-3 py-1 text-custom-xs text-red" onClick={async () => { await deleteProduct(product.id); await load(); }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-4 flex gap-2">
          <button type="button" onClick={() => setMode("single")} className={`rounded-[5px] px-4 py-2 text-custom-sm ${mode === "single" ? "bg-blue text-white" : "bg-white text-dark"}`}>Add One Product</button>
          <button type="button" onClick={() => setMode("many")} className={`rounded-[5px] px-4 py-2 text-custom-sm ${mode === "many" ? "bg-blue text-white" : "bg-white text-dark"}`}>Add Many Products</button>
        </div>

        {mode === "single" ? (
          <form onSubmit={saveSingle} className="rounded-lg bg-white p-5 shadow-1">
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Discount" value={form.discounted_price} onChange={(event) => setForm({ ...form, discounted_price: event.target.value })} />
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Stock" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
              {categorySelect(form.category, (value) => setForm({ ...form, category: value }))}
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Image URL" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} />
              <input className="rounded border border-gray-3 px-3 py-2 outline-none" type="file" accept="image/*" onChange={(event) => setForm({ ...form, image_file: event.target.files?.[0] ?? null })} />
            </div>
            <textarea className="mt-4 min-h-[110px] w-full rounded border border-gray-3 px-3 py-2 outline-none" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {filterGroups.map((group) => (
                <label key={group.id} className="block text-custom-sm text-dark">{group.name}
                  <select multiple className="mt-2 min-h-[96px] w-full rounded border border-gray-3 px-3 py-2 outline-none" value={form.filters} onChange={(event) => setForm({ ...form, filters: Array.from(event.target.selectedOptions).map((option) => option.value) })}>
                    {group.options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </label>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-custom-sm text-dark"><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-custom-sm text-dark"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Active</label>
            </div>
            {error && <p className="mt-3 text-custom-xs text-red">{error}</p>}
            <button type="submit" disabled={saving} className="mt-5 rounded-[5px] bg-blue px-4 py-2 text-custom-sm font-medium text-white disabled:opacity-60">{saving ? "Saving" : "Save Product"}</button>
          </form>
        ) : (
          <form onSubmit={saveMany} className="rounded-lg bg-white p-5 shadow-1">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-custom-sm">
                <thead><tr className="text-left text-dark"><th>Title</th><th>Category</th><th>Price</th><th>Discount</th><th>Stock</th><th>Image</th><th>Description</th><th>Remove</th></tr></thead>
                <tbody>
                  {many.map((row, index) => (
                    <tr key={index}>
                      <td><input className="my-2 w-full rounded border border-gray-3 px-2 py-1.5 outline-none" value={row.title} onChange={(event) => setMany(many.map((item, i) => i === index ? { ...item, title: event.target.value } : item))} /></td>
                      <td>{categorySelect(row.category, (value) => setMany(many.map((item, i) => i === index ? { ...item, category: value } : item)))}</td>
                      <td><input className="w-full rounded border border-gray-3 px-2 py-1.5 outline-none" value={row.price} onChange={(event) => setMany(many.map((item, i) => i === index ? { ...item, price: event.target.value } : item))} /></td>
                      <td><input className="w-full rounded border border-gray-3 px-2 py-1.5 outline-none" value={row.discounted_price} onChange={(event) => setMany(many.map((item, i) => i === index ? { ...item, discounted_price: event.target.value } : item))} /></td>
                      <td><input className="w-full rounded border border-gray-3 px-2 py-1.5 outline-none" value={row.stock} onChange={(event) => setMany(many.map((item, i) => i === index ? { ...item, stock: event.target.value } : item))} /></td>
                      <td><input className="w-full rounded border border-gray-3 px-2 py-1.5 outline-none" value={row.image_url} onChange={(event) => setMany(many.map((item, i) => i === index ? { ...item, image_url: event.target.value } : item))} /></td>
                      <td><input className="w-full rounded border border-gray-3 px-2 py-1.5 outline-none" value={row.description} onChange={(event) => setMany(many.map((item, i) => i === index ? { ...item, description: event.target.value } : item))} /></td>
                      <td><button type="button" className="rounded bg-red-light-6 px-3 py-1 text-custom-xs text-red" onClick={() => setMany(many.filter((_, i) => i !== index))}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {error && <p className="mt-3 text-custom-xs text-red">{error}</p>}
            <div className="mt-5 flex gap-2">
              <button type="button" className="rounded-[5px] bg-gray-2 px-4 py-2 text-custom-sm font-medium text-dark" onClick={() => setMany([...many, { ...emptyForm }])}>+ Add another product</button>
              <button type="submit" disabled={saving} className="rounded-[5px] bg-blue px-4 py-2 text-custom-sm font-medium text-white disabled:opacity-60">{saving ? "Saving" : "Save Products"}</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

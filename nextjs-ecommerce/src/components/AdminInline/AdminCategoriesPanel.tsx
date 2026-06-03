"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { asArray } from "@/types/api";
import { ApiCategory } from "@/types/productApi";
import { createCategory, deleteCategory, getAdminCategories, updateCategory } from "@/lib/api/products";
import { useEditMode } from "./EditModeProvider";

type CategoryForm = {
  id?: number;
  parent: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  is_active: boolean;
};

const emptyForm: CategoryForm = { parent: "", title: "", slug: "", description: "", image: "", is_active: true };

const flattenCategories = (categories: ApiCategory[], depth = 0): Array<ApiCategory & { depth: number }> =>
  categories.flatMap((category) => [{ ...category, depth }, ...flattenCategories(category.children ?? [], depth + 1)]);

export default function AdminCategoriesPanel() {
  const { isAdmin } = useEditMode();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const flatCategories = useMemo(() => flattenCategories(categories), [categories]);

  const load = () =>
    getAdminCategories()
      .then((data) => setCategories(asArray(data)))
      .catch(() => setCategories([]));

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      parent: form.parent ? Number(form.parent) : null,
      title: form.title,
      slug: form.slug,
      description: form.description,
      image: form.image,
      is_active: form.is_active,
    };

    try {
      if (form.id) await updateCategory(form.id, payload);
      else await createCategory(payload);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save category.");
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return <div className="py-20 text-center text-dark">Admin access required.</div>;

  return (
    <section className="overflow-hidden bg-[#f3f4f6] py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        <div className="mb-7.5 flex items-center justify-between">
          <h1 className="font-semibold text-xl xl:text-heading-5 text-dark">Categories</h1>
          <a href="/admin/products" className="rounded-[5px] bg-blue px-4 py-2 text-custom-sm font-medium text-white">View All Products</a>
        </div>

        <div className="grid gap-7.5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg bg-white p-5 shadow-1">
            <h2 className="mb-4 font-medium text-dark">Category Tree</h2>
            <div className="flex flex-col gap-2">
              {flatCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between rounded border border-gray-3 px-3 py-2">
                  <div style={{ paddingLeft: category.depth * 18 }}>
                    <p className="font-medium text-dark">{category.title}</p>
                    <p className="text-custom-xs text-dark-4">{category.slug} · {category.product_count ?? 0} products</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="rounded bg-gray-1 px-3 py-1 text-custom-xs text-dark" onClick={() => setForm({
                      id: category.id,
                      parent: category.parent ? String(category.parent) : "",
                      title: category.title,
                      slug: category.slug,
                      description: category.description,
                      image: category.image,
                      is_active: category.is_active ?? true,
                    })}>Edit</button>
                    <button type="button" className="rounded bg-red-light-6 px-3 py-1 text-custom-xs text-red" onClick={async () => { await deleteCategory(category.id); await load(); }}>Delete</button>
                  </div>
                </div>
              ))}
              {!flatCategories.length && <p className="text-custom-sm text-dark-4">No categories yet.</p>}
            </div>
          </div>

          <form onSubmit={submit} className="rounded-lg bg-white p-5 shadow-1">
            <h2 className="mb-4 font-medium text-dark">{form.id ? "Edit Category" : "Add Category"}</h2>
            <label className="mb-2 block text-custom-xs font-medium text-dark">Parent</label>
            <select className="mb-3 w-full rounded border border-gray-3 px-3 py-2 outline-none" value={form.parent} onChange={(event) => setForm({ ...form, parent: event.target.value })}>
              <option value="">Main category</option>
              {flatCategories.map((category) => <option key={category.id} value={category.id}>{"- ".repeat(category.depth)}{category.title}</option>)}
            </select>
            <label className="mb-2 block text-custom-xs font-medium text-dark">Title</label>
            <input className="mb-3 w-full rounded border border-gray-3 px-3 py-2 outline-none" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            <label className="mb-2 block text-custom-xs font-medium text-dark">Slug</label>
            <input className="mb-3 w-full rounded border border-gray-3 px-3 py-2 outline-none" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            <label className="mb-2 block text-custom-xs font-medium text-dark">Image URL</label>
            <input className="mb-3 w-full rounded border border-gray-3 px-3 py-2 outline-none" value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} />
            <label className="mb-2 block text-custom-xs font-medium text-dark">Description</label>
            <textarea className="mb-3 min-h-[96px] w-full rounded border border-gray-3 px-3 py-2 outline-none" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <label className="mb-4 flex items-center gap-2 text-custom-sm text-dark"><input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /> Active</label>
            {error && <p className="mb-3 text-custom-xs text-red">{error}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="rounded-[5px] bg-blue px-4 py-2 text-custom-sm font-medium text-white disabled:opacity-60">{saving ? "Saving" : "Save"}</button>
              <button type="button" className="rounded-[5px] bg-gray-2 px-4 py-2 text-custom-sm font-medium text-dark" onClick={() => setForm(emptyForm)}>Clear</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

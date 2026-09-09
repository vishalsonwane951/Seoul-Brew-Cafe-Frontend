import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Panel,
  StatCard,
  StatsGrid,
  Btn,
  Badge,
  Toggle,
  Tbl,
  Td,
} from "../components/AdminUI";
import {
  Modal,
  FormGroup,
  inputStyle,
  selectStyle,
  textareaStyle,
} from "../components/SharedUI";
import API from "../../services/api";

const CATS = ["coffee", "matcha", "tea", "latte", "food", "bakery"];

const isImage = (val) =>
  val &&
  (val.startsWith("data:") ||
    val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("//"));

// ─── Image Upload Widget ───────────────────────────────────────────────────
const ImageUpload = ({ value, onChange }) => {
  const hasImage = isImage(value);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    alert("Image must be under 5MB");
    return;
  }

  setUploading(true);

  try {
    const res = await API.get(
      `/s3/presign?type=${encodeURIComponent(file.type)}`
    );

    const { url, publicUrl } = res.data;

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${uploadRes.status}`);
    }

    // Force HTTPS
    const securePublicUrl = publicUrl.replace(/^http:\/\//, "https://");

    onChange(securePublicUrl);
  } catch (err) {
    console.error("Image upload error:", err);
    alert("Image upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {hasImage && (
        <img
          src={value}
          alt="preview"
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      )}
      <label
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px dashed rgba(255,255,255,0.25)",
          cursor: uploading ? "not-allowed" : "pointer",
          fontSize: "0.8rem",
          color: "rgba(245,240,232,0.7)",
          opacity: uploading ? 0.6 : 1,
        }}
      >
        {uploading ? "Uploading…" : hasImage ? "Change Image" : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </label>
      {hasImage && !uploading && (
        <button
          onClick={() => onChange("☕")}
          style={{
            background: "none",
            border: "none",
            color: "rgba(245,240,232,0.4)",
            fontSize: "0.75rem",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
          }}
        >
          Remove image
        </button>
      )}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function Menu() {
  const { menu, setMenu, fetchMenu, showToast, user } = useApp();
  const [catFilter, setCatFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [inventory, setInventory] = useState([]);

  // ✅ FIX: form uses imageUrl not editItem reference
  const [form, setForm] = useState({
    name: "",
    category: "coffee",
    price: "",
    desc: "",
    allergens: "",
    imageUrl: "",
    recipe: [],
  });

  const token = localStorage.getItem("token") || user?.token;

  useEffect(() => {
    if (!token) return;
    API.get("/inventory")
      .then((res) => setInventory(res.data || []))
      .catch(() => {});
  }, [token]);

  const filtered = (menu || []).filter(
    (m) => catFilter === "all" || m.category === catFilter
  );

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!form.name || !form.price)
      return showToast("Please fill required fields");

    const recipe = (form.recipe || [])
      .filter((r) => r.inventoryItemId && Number(r.quantityPerServing) > 0)
      .map((r) => ({
        inventoryItemId: r.inventoryItemId,
        quantityPerServing: Number(r.quantityPerServing),
      }));

    try {
      const res = await API.post("/menu", {
        title: form.name,
        category: form.category,
        price: Number(form.price),
        description: form.desc,
        allergens: form.allergens,
        imageUrl: form.imageUrl || "☕",
        available: true,
        kcal: form.kcal || 0,
        recipe,
      });

      setMenu((prev) => [res.data, ...prev]);
      showToast("Menu item added!");
      setAddOpen(false);
      setForm({
        name: "",
        category: "coffee",
        price: "",
        desc: "",
        allergens: "",
        imageUrl: "",
        recipe: [],
      });
    } catch (err) {
      console.error("Add menu error:", err.response?.data || err.message);
      showToast("Failed to add menu item.");
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = async () => {
    if (!editItem?._id) return showToast("Item ID missing");

    const recipe = (editItem.recipe || [])
      .filter((r) => r.inventoryItemId && Number(r.quantityPerServing) > 0)
      .map((r) => ({
        inventoryItemId: r.inventoryItemId,
        quantityPerServing: Number(r.quantityPerServing),
      }));

    try {
      const res = await API.put(`/menu/${editItem._id}`, {
        title: editItem.title,
        category: editItem.category,
        price: Number(editItem.price),
        description: editItem.description,
        allergens: editItem.allergens,
        imageUrl: editItem.imageUrl || "☕",
        kcal: editItem.kcal || 0,
        available: editItem.available,
        recipe,
      });

      setMenu((prev) =>
        prev.map((m) => (m._id !== res.data._id ? m : { ...m, ...res.data }))
      );
      fetchMenu();
      showToast(`"${res.data.title}" updated!`);
      setEditItem(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to update item.");
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const del = async (id) => {
    try {
      await API.delete(`/menu/${id}`);
      setMenu((prev) => prev.filter((item) => item._id !== id));
      fetchMenu();
      showToast("Item deleted");
    } catch (err) {
      console.error(err);
      showToast("Delete failed");
    }
  };

  // ── Toggle availability ──────────────────────────────────────────────────
  const toggl = async (itemId) => {
    const item = menu.find((m) => m._id === itemId);

    // Optimistic update
    setMenu((prev) =>
      prev.map((m) =>
        m._id === itemId
          ? { ...m, available: !m.available, stock: !m.available }
          : m
      )
    );

    try {
      const res = await API.patch(`/menu/${itemId}/availability`, {});
      setMenu((prev) =>
        prev.map((m) =>
          m._id === itemId
            ? { ...m, available: res.data.available, stock: res.data.available }
            : m
        )
      );
      showToast(`Availability updated for "${item?.title}"`);
    } catch (err) {
      console.error(err);
      showToast("Failed to update availability");
      // Revert
      setMenu((prev) =>
        prev.map((m) =>
          m._id === itemId
            ? { ...m, available: !m.available, stock: m.available }
            : m
        )
      );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fade-up">
      <StatsGrid>
        <StatCard label="Total Items" value={(menu || []).length} />
        <StatCard
          label="Available"
          value={(menu || []).filter((m) => m.available).length}
          valueColor="#4caf7a"
        />
        <StatCard
          label="Unavailable"
          value={(menu || []).filter((m) => !m.available).length}
          valueColor="#e05555"
        />
        <StatCard label="Categories" value={CATS.length} />
      </StatsGrid>

      <Panel
        title="Menu Items"
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <select
              style={{ ...selectStyle(), width: 140, padding: "6px 10px" }}
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <Btn variant="primary" onClick={() => setAddOpen(true)}>
              + Add Item
            </Btn>
          </div>
        }
      >
        <Tbl
          headers={[
            "",
            "Name",
            "Category",
            "Price",
            "Sales",
            "Stock",
            "Available",
            "Actions",
          ]}
        >
          {filtered.map((m) => (
            <tr key={m._id || m.id}>
              <Td>
                {isImage(m.imageUrl) ? (
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    crossOrigin="anonymous"
                    style={{
                      width: 38,
                      height: 38,
                      objectFit: "cover",
                      borderRadius: 6,
                      display: "block",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "1.4rem" }}>
                    {m.imageUrl || "☕"}
                  </span>
                )}
              </Td>
              <Td bold>{m.title}</Td>
              <Td mono>{m.category}</Td>
              <Td amber>₹{m.price.toLocaleString()}</Td>
              <Td mono>{m.sales}</Td>
              <Td>
                <Badge type={m.stock ? "ready" : "low"}>
                  {m.stock ? "In Stock" : "Out of Stock"}
                </Badge>
              </Td>
              <Td>
                <Toggle on={m.stock} onChange={() => toggl(m._id)} />
              </Td>
              <Td>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditItem({ ...m, price: String(m.price) })
                    }
                  >
                    Edit
                  </Btn>
                  <Btn
                    variant="danger"
                    size="sm"
                    onClick={() => del(m._id)}
                  >
                    Del
                  </Btn>
                </div>
              </Td>
            </tr>
          ))}
        </Tbl>
      </Panel>

      {/* ── Add Modal ───────────────────────────────────────────────────── */}
      <Modal
        title="Add Menu Item"
        open={addOpen}
        onClose={() => setAddOpen(false)}
      >
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          <FormGroup label="Item Name *">
            <input
              style={inputStyle()}
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              placeholder="e.g. Boba Matcha"
            />
          </FormGroup>

          <FormGroup label="Category">
            <select
              style={selectStyle()}
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
            >
              {CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup label="Price (₹) *">
            <input
              style={inputStyle()}
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((p) => ({ ...p, price: e.target.value }))
              }
              placeholder="5500"
            />
          </FormGroup>

          <FormGroup label="Allergens">
            <input
              style={inputStyle()}
              value={form.allergens}
              onChange={(e) =>
                setForm((p) => ({ ...p, allergens: e.target.value }))
              }
              placeholder="Milk, Gluten…"
            />
          </FormGroup>

          {/* ✅ FIX: was using editItem.imageUrl — now correctly uses form */}
          <FormGroup label="Image" style={{ gridColumn: "1 / -1" }}>
            <ImageUpload
              value={form.imageUrl}
              onChange={(val) => setForm((p) => ({ ...p, imageUrl: val }))}
            />
          </FormGroup>
        </div>

        <FormGroup label="Description">
          <textarea
            style={textareaStyle()}
            value={form.desc}
            onChange={(e) =>
              setForm((p) => ({ ...p, desc: e.target.value }))
            }
            placeholder="Describe the item…"
          />
        </FormGroup>

        <FormGroup label="Ingredients (track stock per order)">
          <p
            style={{
              fontSize: "0.7rem",
              color: "rgba(245,240,232,0.5)",
              marginBottom: 8,
            }}
          >
            Link to inventory: stock is deducted when orders are placed.
          </p>
          {(form.recipe || []).map((r, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <select
                style={{ ...selectStyle(), flex: 1 }}
                value={r.inventoryItemId || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    recipe: p.recipe.map((x, i) =>
                      i === idx
                        ? { ...x, inventoryItemId: e.target.value }
                        : x
                    ),
                  }))
                }
              >
                <option value="">Select ingredient</option>
                {inventory.map((inv) => (
                  <option key={inv._id} value={inv._id}>
                    {inv.name} ({inv.detail})
                  </option>
                ))}
              </select>
              <input
                style={{ ...inputStyle(), width: 80 }}
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty/serve"
                value={r.quantityPerServing ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    recipe: p.recipe.map((x, i) =>
                      i === idx
                        ? { ...x, quantityPerServing: e.target.value }
                        : x
                    ),
                  }))
                }
              />
              <Btn
                variant="ghost"
                size="sm"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    recipe: p.recipe.filter((_, i) => i !== idx),
                  }))
                }
              >
                Remove
              </Btn>
            </div>
          ))}
          <Btn
            variant="ghost"
            size="sm"
            onClick={() =>
              setForm((p) => ({
                ...p,
                recipe: [
                  ...(p.recipe || []),
                  { inventoryItemId: "", quantityPerServing: "" },
                ],
              }))
            }
          >
            + Add ingredient
          </Btn>
        </FormGroup>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 16,
          }}
        >
          <Btn variant="ghost" onClick={() => setAddOpen(false)}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={handleAdd}>
            Add Item
          </Btn>
        </div>
      </Modal>

      {/* ── Edit Modal ──────────────────────────────────────────────────── */}
      <Modal
        title="Edit Menu Item"
        open={!!editItem}
        onClose={() => setEditItem(null)}
      >
        {editItem && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              <FormGroup label="Name">
                <input
                  style={inputStyle()}
                  value={editItem.title}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </FormGroup>

              <FormGroup label="Category">
                <select
                  style={selectStyle()}
                  value={editItem.category}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  {CATS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup label="Price (₹)">
                <input
                  style={inputStyle()}
                  type="number"
                  value={editItem.price}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, price: e.target.value }))
                  }
                />
              </FormGroup>

              <FormGroup label="Allergens">
                <input
                  style={inputStyle()}
                  value={editItem.allergens || ""}
                  onChange={(e) =>
                    setEditItem((p) => ({ ...p, allergens: e.target.value }))
                  }
                />
              </FormGroup>

              <FormGroup label="Description" style={{ gridColumn: "1 / -1" }}>
                <textarea
                  style={{ ...inputStyle(), resize: "vertical", minHeight: 60 }}
                  value={editItem.description || ""}
                  onChange={(e) =>
                    setEditItem((p) => ({
                      ...p,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Enter item description"
                />
              </FormGroup>

              <FormGroup label="Image" style={{ gridColumn: "1 / -1" }}>
                <ImageUpload
                  value={editItem.imageUrl}
                  onChange={(val) =>
                    setEditItem((p) => ({ ...p, imageUrl: val }))
                  }
                />
              </FormGroup>
            </div>

            <FormGroup label="Ingredients (track stock per order)">
              <p
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(245,240,232,0.5)",
                  marginBottom: 8,
                }}
              >
                Stock is deducted from inventory when orders are placed.
              </p>
              {(editItem.recipe || []).map((r, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <select
                    style={{ ...selectStyle(), flex: 1 }}
                    value={
                      r.inventoryItemId?._id
                        ? r.inventoryItemId._id
                        : r.inventoryItemId || ""
                    }
                    onChange={(e) =>
                      setEditItem((p) => ({
                        ...p,
                        recipe: (p.recipe || []).map((x, i) =>
                          i === idx
                            ? { ...x, inventoryItemId: e.target.value }
                            : x
                        ),
                      }))
                    }
                  >
                    <option value="">Select ingredient</option>
                    {inventory.map((inv) => (
                      <option key={inv._id} value={inv._id}>
                        {inv.name} ({inv.detail})
                      </option>
                    ))}
                  </select>
                  <input
                    style={{ ...inputStyle(), width: 80 }}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Qty/serve"
                    value={r.quantityPerServing ?? ""}
                    onChange={(e) =>
                      setEditItem((p) => ({
                        ...p,
                        recipe: (p.recipe || []).map((x, i) =>
                          i === idx
                            ? { ...x, quantityPerServing: e.target.value }
                            : x
                        ),
                      }))
                    }
                  />
                  <Btn
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setEditItem((p) => ({
                        ...p,
                        recipe: (p.recipe || []).filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    Remove
                  </Btn>
                </div>
              ))}
              <Btn
                variant="ghost"
                size="sm"
                onClick={() =>
                  setEditItem((p) => ({
                    ...p,
                    recipe: [
                      ...(p.recipe || []),
                      { inventoryItemId: "", quantityPerServing: "" },
                    ],
                  }))
                }
              >
                + Add ingredient
              </Btn>
            </FormGroup>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <Btn variant="ghost" onClick={() => setEditItem(null)}>
                Cancel
              </Btn>
              <Btn variant="primary" onClick={handleEdit}>
                Save Changes
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
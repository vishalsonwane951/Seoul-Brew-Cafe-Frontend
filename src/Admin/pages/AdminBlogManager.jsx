import { useState, useRef, useCallback } from "react";
import { colors, fonts } from "../../tokens";
import API from "../../services/api.js";

// ── Field components ───────────────────────────────────────────
const Label = ({ children }) => (
  <label style={{ display: "block", fontFamily: fonts.sans, fontSize: "0.65rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted, marginBottom: "6px", fontWeight: 500 }}>
    {children}
  </label>
);

const Input = ({ value, onChange, placeholder, style = {} }) => {
  const [f, setF] = useState(false);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={{
        width: "100%", padding: "11px 14px",
        fontFamily: fonts.sans, fontSize: "0.88rem",
        color: colors.ink, background: colors.white,
        border: `1px solid ${f ? colors.accent : colors.line}`,
        outline: "none", transition: "border-color 0.2s",
        boxSizing: "border-box", ...style,
      }}
    />
  );
};

const Textarea = ({ value, onChange, placeholder, rows = 4 }) => {
  const [f, setF] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={{
        width: "100%", padding: "11px 14px",
        fontFamily: fonts.sans, fontSize: "0.88rem",
        color: colors.ink, background: colors.white,
        border: `1px solid ${f ? colors.accent : colors.line}`,
        outline: "none", transition: "border-color 0.2s",
        resize: "vertical", boxSizing: "border-box", lineHeight: 1.7,
      }}
    />
  );
};

const Select = ({ value, onChange, options }) => {
  const [f, setF] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setF(true)}
      onBlur={() => setF(false)}
      style={{
        width: "100%", padding: "11px 14px",
        fontFamily: fonts.sans, fontSize: "0.88rem",
        color: colors.ink, background: colors.white,
        border: `1px solid ${f ? colors.accent : colors.line}`,
        outline: "none", transition: "border-color 0.2s",
        appearance: "none", cursor: "pointer", boxSizing: "border-box",
      }}
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
};

const TAGS = ["Origin", "Sourcing", "Culture", "Team", "Menu", "Events"];
const EMPTY = { title: "", description: "", content: "", author: "", date: "", tag: TAGS[0], images: [] };

// ── Drag-and-drop image upload zone ───────────────────────────
const DropZone = ({ onFiles }) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onFiles(files);
    e.target.value = "";
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragEnter={(e) => { e.preventDefault(); setDrag(true); }}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      style={{
        border: `2px dashed ${drag ? colors.accent : colors.line}`,
        background: drag ? "rgba(200,169,126,0.05)" : colors.off,
        padding: "40px 24px",
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* Upload icon */}
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={drag ? colors.accent : colors.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "12px" }}>
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      </svg>

      <div style={{ fontFamily: fonts.sans, fontSize: "0.85rem", color: drag ? colors.accent : colors.ink, marginBottom: "6px", fontWeight: 400 }}>
        {drag ? "Drop images here" : "Click to upload or drag & drop"}
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: "0.72rem", color: colors.muted }}>
        PNG, JPG, WEBP · Multiple files allowed · First image becomes cover
      </div>
    </div>
  );
};

// ── Single image preview tile ──────────────────────────────────
const ImageTile = ({ img, index, total, onRemove, onMoveLeft, onMoveRight }) => {
  const [h, setH] = useState(false);

  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: "relative",
        aspectRatio: "1",
        overflow: "hidden",
        background: colors.off,
        border: `1px solid ${index === 0 ? colors.accent : colors.line}`,
        transition: "border-color 0.2s",
      }}
    >
      {/* Image */}
      <img
        src={img.preview}
        alt={img.name}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {/* Cover badge */}
      {index === 0 && (
        <div style={{
          position: "absolute", top: "8px", left: "8px",
          background: colors.accent, color: colors.white,
          fontFamily: fonts.sans, fontSize: "0.55rem",
          letterSpacing: "1.5px", textTransform: "uppercase",
          padding: "3px 8px",
        }}>
          Cover
        </div>
      )}

      {/* Uploading spinner */}
      {img.uploading && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(26,15,10,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: "24px", height: "24px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
        </div>
      )}

      {/* Upload error */}
      {img.error && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(192,57,43,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: fonts.sans, fontSize: "0.7rem", color: "#fff", padding: "8px", textAlign: "center",
        }}>
          Upload failed
        </div>
      )}

      {/* Hover controls */}
      {h && !img.uploading && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(26,15,10,0.5)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: "8px",
        }}>
          {/* Reorder row */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              onClick={() => onMoveLeft(index)}
              disabled={index === 0}
              style={{
                width: "30px", height: "30px", background: index === 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.85)",
                border: "none", cursor: index === 0 ? "not-allowed" : "pointer",
                color: colors.ink, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ‹
            </button>
            <button
              onClick={() => onMoveRight(index)}
              disabled={index === total - 1}
              style={{
                width: "30px", height: "30px", background: index === total - 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.85)",
                border: "none", cursor: index === total - 1 ? "not-allowed" : "pointer",
                color: colors.ink, fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ›
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(index)}
            style={{
              padding: "5px 14px", background: "#c0392b",
              border: "none", color: "#fff",
              fontFamily: fonts.sans, fontSize: "0.6rem",
              letterSpacing: "1.5px", textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Index badge */}
      {!h && index > 0 && (
        <div style={{
          position: "absolute", bottom: "6px", right: "8px",
          fontFamily: fonts.sans, fontSize: "0.6rem",
          color: "rgba(255,255,255,0.7)",
        }}>
          {index + 1} / {total}
        </div>
      )}
    </div>
  );
};

// ── Blog list row ──────────────────────────────────────────────
const BlogRow = ({ blog, onEdit, onDelete }) => {
  const [hEdit, setHEdit] = useState(false);
  const [hDel, setHDel] = useState(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px 20px", borderBottom: `1px solid ${colors.line}`, background: colors.white }}>
      <div style={{ width: "48px", height: "48px", flexShrink: 0, overflow: "hidden", background: colors.off, border: `1px solid ${colors.line}` }}>
        {blog.images?.[0] && <img src={blog.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: fonts.serif, fontSize: "0.95rem", color: colors.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{blog.title}</div>
        <div style={{ fontFamily: fonts.sans, fontSize: "0.7rem", color: colors.muted, marginTop: "3px" }}>{blog.tag} · {blog.author} · {blog.date}</div>
      </div>
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button onMouseEnter={() => setHEdit(true)} onMouseLeave={() => setHEdit(false)} onClick={() => onEdit(blog)}
          style={{ padding: "6px 16px", background: hEdit ? colors.ink : "transparent", color: hEdit ? colors.white : colors.ink, border: `1px solid ${colors.line}`, fontFamily: fonts.sans, fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
          Edit
        </button>
        <button onMouseEnter={() => setHDel(true)} onMouseLeave={() => setHDel(false)} onClick={() => onDelete(blog._id)}
          style={{ padding: "6px 16px", background: hDel ? "#c0392b" : "transparent", color: hDel ? colors.white : "#c0392b", border: `1px solid ${hDel ? "#c0392b" : "#f5c0c0"}`, fontFamily: fonts.sans, fontSize: "0.65rem", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────
const AdminBlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [images, setImages] = useState([]); // [{ file, preview, uploading, error, url }]
  const [editId, setEditId] = useState(null);
  const [view, setView] = useState("list");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  // ── Add files from picker/drop ─────────────────────────────
  const handleFiles = useCallback(async (files) => {
    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      error: false,
      url: null,
      name: file.name,
    }));

    setImages((prev) => [...prev, ...newImgs]);

    // Upload each file
    const startIndex = images.length;
    await Promise.all(
      files.map(async (file, i) => {
        const idx = startIndex + i;
        try {
          const data = new FormData();
          data.append("image", file);
          const res = await API.post("/upload/image", data, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const url = res.data.url; // adjust to your API response shape
          setImages((prev) => prev.map((img, j) => j === idx ? { ...img, uploading: false, url } : img));
        } catch {
          setImages((prev) => prev.map((img, j) => j === idx ? { ...img, uploading: false, error: true } : img));
        }
      })
    );
  }, [images.length]);

  const removeImage = (i) => {
    setImages((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[i].preview);
      next.splice(i, 1);
      return next;
    });
  };

  const moveImage = (from, to) => {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const openCreate = () => { setForm(EMPTY); setImages([]); setEditId(null); setView("form"); };

  const openEdit = (blog) => {
    setForm({ ...blog });
    // Reconstruct image objects from saved URLs
    setImages((blog.images || []).map((url) => ({ file: null, preview: url, uploading: false, error: false, url, name: url })));
    setEditId(blog._id);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await API.delete(`/blogs/${id}`);
      setBlogs((b) => b.filter((x) => x._id !== id));
      showToast("Blog deleted.");
    } catch {
      showToast("Failed to delete.", "error");
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showToast("Title and content are required.", "error");
      return;
    }
    const stillUploading = images.some((i) => i.uploading);
    if (stillUploading) {
      showToast("Please wait — images are still uploading.", "error");
      return;
    }
    const failedCount = images.filter((i) => i.error).length;
    if (failedCount > 0) {
      showToast(`${failedCount} image(s) failed to upload. Remove them and try again.`, "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        images: images.filter((i) => i.url).map((i) => i.url),
      };

      if (editId) {
        const res = await API.put(`/blogs/${editId}`, payload);
        setBlogs((b) => b.map((x) => (x._id === editId ? res.data : x)));
        showToast("Blog updated.");
      } else {
        const res = await API.post("/blogs", payload);
        setBlogs((b) => [res.data, ...b]);
        showToast("Blog published!");
      }
      setView("list");
      setForm(EMPTY);
      setImages([]);
      setEditId(null);
    } catch {
      showToast("Failed to save.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setForm(EMPTY); setImages([]); setEditId(null); setView("list"); };

  // ── FORM VIEW ────────────────────────────────────────────────
  if (view === "form") return (
    <div style={{ padding: "clamp(20px, 4vw, 40px)", maxWidth: "800px", margin: "0 auto" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px", flexWrap: "wrap" }}>
        <button onClick={handleCancel} style={{ background: "none", border: "none", fontFamily: fonts.sans, fontSize: "0.7rem", letterSpacing: "2px", textTransform: "uppercase", color: colors.muted, cursor: "pointer", padding: 0 }}>
          ← Back
        </button>
        <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 400, color: colors.ink, margin: 0 }}>
          {editId ? "Edit Blog Post" : <span>New <em style={{ fontStyle: "italic", color: colors.accent }}>Blog Post</em></span>}
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

        {/* Title */}
        <div>
          <Label>Title *</Label>
          <Input value={form.title} onChange={set("title")} placeholder="e.g. Behind the Espresso Bar" />
        </div>

        {/* Tag + Date */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
          <div>
            <Label>Tag / Category</Label>
            <Select value={form.tag} onChange={set("tag")} options={TAGS} />
          </div>
          <div>
            <Label>Date</Label>
            <Input value={form.date} onChange={set("date")} placeholder="e.g. Nov 2024" />
          </div>
        </div>

        {/* Author */}
        <div>
          <Label>Author</Label>
          <Input value={form.author} onChange={set("author")} placeholder="e.g. Seo Jiyeon" />
        </div>

        {/* Short description */}
        <div>
          <Label>Short Description (card excerpt)</Label>
          <Textarea value={form.description} onChange={set("description")} placeholder="One or two sentences shown on the blog card..." rows={2} />
        </div>

        {/* Full content */}
        <div>
          <Label>Full Content * (blank line = new paragraph)</Label>
          <Textarea value={form.content} onChange={set("content")} placeholder={"Write the full blog post here...\n\nLeave a blank line to start a new paragraph."} rows={12} />
        </div>

        {/* ── Image upload ── */}
        <div>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "12px" }}>
            <Label>Photos</Label>
            {images.length > 0 && (
              <span style={{ fontFamily: fonts.sans, fontSize: "0.68rem", color: colors.muted }}>
                {images.length} image{images.length !== 1 ? "s" : ""} · hover to reorder or remove · first = cover
              </span>
            )}
          </div>

          {/* Drop zone always visible */}
          <DropZone onFiles={handleFiles} />

          {/* Preview grid */}
          {images.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: "8px",
              marginTop: "16px",
            }}>
              {images.map((img, i) => (
                <ImageTile
                  key={img.preview}
                  img={img}
                  index={i}
                  total={images.length}
                  onRemove={removeImage}
                  onMoveLeft={(i) => moveImage(i, i - 1)}
                  onMoveRight={(i) => moveImage(i, i + 1)}
                />
              ))}
            </div>
          )}

          {/* Upload status summary */}
          {images.some((i) => i.uploading) && (
            <div style={{ marginTop: "12px", fontFamily: fonts.sans, fontSize: "0.75rem", color: colors.muted, display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "12px", height: "12px", border: "2px solid rgba(26,15,10,0.2)", borderTopColor: colors.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite", flexShrink: 0 }} />
              Uploading {images.filter((i) => i.uploading).length} image{images.filter((i) => i.uploading).length !== 1 ? "s" : ""}…
            </div>
          )}
          {images.some((i) => i.error) && (
            <div style={{ marginTop: "10px", fontFamily: fonts.sans, fontSize: "0.75rem", color: "#c0392b" }}>
              {images.filter((i) => i.error).length} image(s) failed. Remove the failed tile(s) and try again.
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", paddingTop: "8px", flexWrap: "wrap" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "14px 40px",
              background: saving ? colors.muted : colors.ink,
              color: colors.white, border: "none",
              fontFamily: fonts.sans, fontSize: "0.75rem",
              letterSpacing: "2px", textTransform: "uppercase",
              cursor: saving ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: "8px",
            }}
          >
            {saving && <span style={{ width: "12px", height: "12px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />}
            {saving ? "Saving…" : editId ? "Update Post" : "Publish Post"}
          </button>
          <button
            onClick={handleCancel}
            style={{ padding: "14px 32px", background: "transparent", color: colors.muted, border: `1px solid ${colors.line}`, fontFamily: fonts.sans, fontSize: "0.75rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ── LIST VIEW ─────────────────────────────────────────────────
  return (
    <div style={{ padding: "clamp(20px, 4vw, 40px)" }}>
      <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {toast && (
        <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 200, padding: "14px 24px", background: toast.type === "error" ? "#c0392b" : colors.ink, color: colors.white, fontFamily: fonts.sans, fontSize: "0.82rem", animation: "fadeSlideIn 0.3s ease" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{ width: "24px", height: "1px", background: colors.accent }} />
            <span style={{ fontFamily: fonts.sans, fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: colors.accent }}>Admin</span>
          </div>
          <h2 style={{ fontFamily: fonts.serif, fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 400, color: colors.ink, margin: 0 }}>
            Blog <em style={{ fontStyle: "italic", color: colors.accent }}>Manager</em>
          </h2>
        </div>
        <button
          onClick={openCreate}
          style={{ padding: "13px 32px", background: colors.ink, color: colors.white, border: "none", fontFamily: fonts.sans, fontSize: "0.72rem", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}>
          + New Post
        </button>
      </div>

      {blogs.length === 0 ? (
        <div style={{ padding: "56px", textAlign: "center", fontFamily: fonts.sans, fontSize: "0.85rem", color: colors.muted, fontStyle: "italic", border: `1px solid ${colors.line}`, background: colors.white }}>
          No blog posts yet. Click "+ New Post" to create one.
        </div>
      ) : (
        <div style={{ border: `1px solid ${colors.line}` }}>
          {blogs.map((blog) => (
            <BlogRow key={blog._id} blog={blog} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBlogManager;
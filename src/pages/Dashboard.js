import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../firebase/config";
import { useAuth } from "../firebase/AuthContext";
import ItemModal from "../components/ItemModal";
import ConfirmDialog from "../components/ConfirmDialog";

// ============================================================
//  STEP 2: Change "items" to whatever collection name you want
// ============================================================
const COLLECTION = "items";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [toast, setToast] = useState(null);

  // ── Fetch all items ──────────────────────────────────────
  async function fetchItems() {
    setLoading(true);
    try {
      const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      // If the collection doesn't exist yet, that's fine
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  // ── Add / Edit ───────────────────────────────────────────
  async function handleSave(formData) {
    try {
      if (editItem) {
        await updateDoc(doc(db, COLLECTION, editItem.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
        showToast("Item updated successfully");
      } else {
        await addDoc(collection(db, COLLECTION), {
          ...formData,
          createdAt: serverTimestamp(),
        });
        showToast("Item added successfully");
      }
      setModalOpen(false);
      setEditItem(null);
      fetchItems();
    } catch (err) {
      showToast("Something went wrong. Try again.", "error");
    }
  }

  // ── Delete ───────────────────────────────────────────────
  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, COLLECTION, id));
      showToast("Item deleted");
      fetchItems();
    } catch {
      showToast("Delete failed. Try again.", "error");
    }
    setConfirmDelete(null);
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setEditItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditItem(item);
    setModalOpen(true);
  }

  return (
    <div className="app-shell">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-brand">
          <span className="navbar-icon">⚡</span>
          <span>My App</span>
        </div>
        <div className="navbar-right">
          <span className="navbar-email">{currentUser?.email}</span>
          <button className="btn btn-ghost" onClick={() => signOut(auth)}>
            Sign out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <div>
            <h2>Items</h2>
            <p className="page-sub">{items.length} record{items.length !== 1 ? "s" : ""} in database</p>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>
            + Add item
          </button>
        </div>

        {loading ? (
          <div className="state-box">Loading…</div>
        ) : items.length === 0 ? (
          <div className="state-box empty">
            <div className="state-icon">📭</div>
            <p>No items yet. Add your first one!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id}>
                    <td className="td-num">{i + 1}</td>
                    <td className="td-title">{item.title}</td>
                    <td className="td-desc">{item.description || "—"}</td>
                    <td>
                      <span className={`badge badge-${item.status || "active"}`}>
                        {item.status || "active"}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setConfirmDelete(item)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <ItemModal
          item={editItem}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditItem(null); }}
        />
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <ConfirmDialog
          message={`Delete "${confirmDelete.title}"? This cannot be undone.`}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.msg}</div>
      )}
    </div>
  );
}

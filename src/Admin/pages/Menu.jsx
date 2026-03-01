import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Panel, StatCard, StatsGrid, Btn, Badge, Toggle, Tbl, Td } from '../components/AdminUI';
import { Modal, FormGroup, inputStyle, selectStyle, textareaStyle } from '../components/SharedUI';
import { useContext } from 'react';
import { MenuContext } from '../../context/MenuContext';
import API from '../../services/api';

const CATS = ['coffee', 'matcha', 'tea', 'latte', 'food', 'bakery'];

export default function Menu() {
    const { showToast, user } = useApp();
    const { menu, setMenu, fetchMenu } = useContext(MenuContext);
    const [catFilter, setCatFilter] = useState('all');
    const [addOpen, setAddOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [form, setForm] = useState({
        name: '',
        category: 'coffee',
        price: '',
        desc: '',
        allergens: '',
        imageUrl: '☕',
        recipe: [],
    });
    const token = user?.token || localStorage.getItem('token');

    useEffect(() => {
        if (!token) return;
        API.get('/inventory', { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => setInventory(res.data || []))
            .catch(() => {});
    }, [token]);

    // Fetch menu items from API on mount
    // useEffect(() => {
    //     if (!token || !user || user.role !== 'admin') return; // only admin can access

    //     const fetchMenu = async () => {
    //         try {
    //             const res = await axios.get('http://localhost:5000/api/menu', {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             });
    //             setMenuItems(res.data.map(m => ({
    //                 id: m.id,
    //                 name: m.title,
    //                 category: m.category,
    //                 price: m.price,
    //                 desc: m.description,
    //                 allergens: m.allergens || '',
    //                 available: m.available,
    //                 sales: m.sales || 0,
    //                 stock: m.available ? 'In Stock' : 'Out of Stock',
    //                 img: m.imageUrl || '☕',
    //                 kcal: m.kcal || 0
    //             })));

    //             console.log(`price:${price}`)
    //         } catch (err) {
    //             showToast('Failed to fetch menu items.');
    //         }
    //     };

    //     fetchMenu();
    // }, [token, user, setMenuItems, showToast]);

    const filtered = (menu || []).filter(
        m => catFilter === 'all' || m.category === catFilter
    );

    // Add menu item via API
    const handleAdd = async () => {
        if (!form.name || !form.price) {
            showToast('Please fill required fields.');
            return;
        }

        const recipe = (form.recipe || [])
            .filter((r) => r.inventoryItemId && Number(r.quantityPerServing) > 0)
            .map((r) => ({ inventoryItemId: r.inventoryItemId, quantityPerServing: Number(r.quantityPerServing) }));

        try {
            const res = await API.post(
                '/menu',
                {
                    title: form.name,
                    category: form.category,
                    price: Number(form.price),
                    description: form.desc,
                    allergens: form.allergens,
                    imageUrl: form.imageUrl || '☕',
                    available: true,
                    kcal: form.kcal || 0,
                    recipe,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const newItem = res.data;
            setMenu((prev) => [...prev, { ...newItem }]);
            showToast('Menu item added!');
            setAddOpen(false);
            setForm({ name: '', category: 'coffee', price: '', desc: '', allergens: '', imageUrl: '☕', recipe: [] });

        } catch (err) {
            console.error(err);
            showToast('Failed to add menu item.');
        }
    };


    // Edit menu item via API
    const handleEdit = async () => {
        try {

            if (!editItem?._id) {
                console.error("Missing _id");
                showToast("Item ID missing");
                return;
            }

            const recipe = (editItem.recipe || [])
                .filter((r) => r.inventoryItemId && Number(r.quantityPerServing) > 0)
                .map((r) => ({ inventoryItemId: r.inventoryItemId, quantityPerServing: Number(r.quantityPerServing) }));

            const res = await API.put(
                `/menu/${editItem._id}`,
                {
                    title: editItem.title,
                    category: editItem.category,
                    price: Number(editItem.price),
                    description: editItem.description,
                    allergens: editItem.allergens,
                    imageUrl: editItem.imageUrl || '☕',
                    kcal: editItem.kcal || 0,
                    available: editItem.available,
                    recipe,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updated = res.data;
            setMenu((prev) => prev.map((m) => (m._id !== updated._id ? m : { ...m, ...updated })));
            fetchMenu();
            showToast(`Item "${updated.title}" updated!`);
            setEditItem(null);

        } catch (err) {
            console.error(err);
            showToast("Failed to update item.");
        }
    };

    // Delete menu item via API
    const del = async (id) => {
        try {
            await API.delete(`/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMenu((prev) => prev.filter((item) => item._id !== id));
            fetchMenu();
            showToast("Item deleted");

        } catch (err) {
            console.error(err);
            showToast("Delete failed");
        }
    };


    // Toggle availability via API
    const toggl = async (itemId) => {
        if (!user?.token || !user?.admin) {
            showToast("Not authorized");
            return;
        }
        const item = menu.find(m => m._id === itemId)
        // Optimistic update
        setMenu(prev =>
            prev.map(m =>
                m._id === itemId
                    ? {
                        ...m,
                        available: !m.available,
                        stock: !m.available   // ✅ boolean, NOT string
                    }
                    : m
            )
        );

        try {
            const res = await API.patch(`/menu/${itemId}/availability`,{},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            // Update from backend response
            setMenu(prev =>
                prev.map(m =>
                    m._id === itemId
                        ? {
                            ...m,
                            available: res.data.available,
                            stock: res.data.available   // ✅ boolean
                        }
                        : m
                )
            );

            showToast(`Availability updated for "${item?.title}"`);

        } catch (err) {
            console.error(err);
            showToast("Failed to update availability");

            // revert if failed
            setMenu(prev =>
                prev.map(m =>
                    m._id === itemId
                        ? {
                            ...m,
                            available: !m.available,
                            stock: m.available
                        }
                        : m
                )
            );
        }
    };


    return (
        <div className="fade-up">
            {/* … rest of your UI remains unchanged … */}
            <StatsGrid>
                <StatCard label="Total Items" value={(menu || []).length} />
                <StatCard label="Available" value={(menu || []).filter(m => m.available).length} valueColor="#4caf7a" />
                <StatCard label="Unavailable" value={(menu || []).filter(m => !m.available).length} valueColor="#e05555" />
                <StatCard label="Categories" value={CATS.length} />
            </StatsGrid>

            <Panel title="Menu Items" action={
                <div style={{ display: 'flex', gap: 10 }}>
                    <select style={{ ...selectStyle(), width: 140, padding: '6px 10px' }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                        <option value="all">All Categories</option>
                        {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <Btn variant="primary" onClick={() => setAddOpen(true)}>+ Add Item</Btn>
                </div>
            }>
                <Tbl headers={['', 'Name', 'Category', 'Price', 'Sales', 'Stock', 'Available', 'Actions']}>
                    {filtered.map(m => (
                        <tr key={m._id || m.id}>
                            <Td><span style={{ fontSize: '1.2rem' }}>{m.imageUrl || m.img || '☕'}</span></Td>
                            <Td bold>{m.title}</Td>
                            <Td mono>{m.category}</Td>
                            <Td amber>₹{m.price.toLocaleString()}</Td>
                            <Td mono>{m.sales}</Td>
                            <Td>
                                <Badge type={m.stock ? 'ready' : 'low'}>
                                    {m.stock ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                            </Td>
                            <Td>
                                <Toggle on={m.stock} onChange={() => toggl(m._id, m.stock)} />
                            </Td>
                            <Td>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <Btn
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setEditItem({
                                                ...m,
                                                price: String(m.price)
                                            })
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

            {/* Add Modal */}
            <Modal title="Add Menu Item" open={addOpen} onClose={() => setAddOpen(false)}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FormGroup label="Item Name *"><input style={inputStyle()} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Boba Matcha" /></FormGroup>
                    <FormGroup label="Category"><select style={selectStyle()} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>{CATS.map(c => <option key={c} value={c}>{c}</option>)}</select></FormGroup>
                    <FormGroup label="Price (₹) *"><input style={inputStyle()} type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="5500" /></FormGroup>
                    <FormGroup label="Allergens"><input style={inputStyle()} value={form.allergens} onChange={e => setForm(p => ({ ...p, allergens: e.target.value }))} placeholder="Milk, Gluten…" /></FormGroup>
                    <FormGroup label="Icon (emoji)"><input style={inputStyle()} value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value || '☕' }))} placeholder="☕" /></FormGroup>
                </div>
                <FormGroup label="Description"><textarea style={textareaStyle()} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} placeholder="Describe the item…" /></FormGroup>
                <FormGroup label="Ingredients (track stock per order)">
                    <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.5)', marginBottom: 8 }}>Link to inventory: stock is deducted when orders are placed.</p>
                    {(form.recipe || []).map((r, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                            <select
                                style={{ ...selectStyle(), flex: 1 }}
                                value={r.inventoryItemId || ''}
                                onChange={e => setForm(p => ({
                                    ...p,
                                    recipe: p.recipe.map((x, i) => i === idx ? { ...x, inventoryItemId: e.target.value } : x),
                                }))}
                            >
                                <option value="">Select ingredient</option>
                                {inventory.map((inv) => (
                                    <option key={inv._id} value={inv._id}>{inv.name} ({inv.detail})</option>
                                ))}
                            </select>
                            <input
                                style={{ ...inputStyle(), width: 80 }}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Qty/serve"
                                value={r.quantityPerServing ?? ''}
                                onChange={e => setForm(p => ({
                                    ...p,
                                    recipe: p.recipe.map((x, i) => i === idx ? { ...x, quantityPerServing: e.target.value } : x),
                                }))}
                            />
                            <Btn variant="ghost" size="sm" onClick={() => setForm(p => ({ ...p, recipe: p.recipe.filter((_, i) => i !== idx) }))}>Remove</Btn>
                        </div>
                    ))}
                    <Btn variant="ghost" size="sm" onClick={() => setForm(p => ({ ...p, recipe: [...(p.recipe || []), { inventoryItemId: '', quantityPerServing: '' }] }))}>+ Add ingredient</Btn>
                </FormGroup>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                    <Btn variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Btn>
                    <Btn variant="primary" onClick={handleAdd}>Add Item</Btn>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal title="Edit Menu Item" open={!!editItem} onClose={() => setEditItem(null)}>
                {editItem && <>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                        <FormGroup label="Name">
                            <input
                                style={inputStyle()}
                                value={editItem.title}
                                onChange={e =>
                                    setEditItem(p => ({ ...p, title: e.target.value }))
                                }
                            />
                        </FormGroup>

                        <FormGroup label="Category">
                            <select
                                style={selectStyle()}
                                value={editItem.category}
                                onChange={e =>
                                    setEditItem(p => ({ ...p, category: e.target.value }))
                                }
                            >
                                {CATS.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </FormGroup>

                        <FormGroup label="Price (₹)">
                            <input
                                style={inputStyle()}
                                type="number"
                                value={editItem.price}
                                onChange={e =>
                                    setEditItem(p => ({ ...p, price: e.target.value }))
                                }
                            />
                        </FormGroup>

                        <FormGroup label="allergens">
                            <input
                                style={inputStyle()}
                                type="text"
                                value={editItem.allergens}
                                onChange={e =>
                                    setEditItem(p => ({ ...p, allergens: e.target.value }))
                                }
                            />
                        </FormGroup>

                        <FormGroup label="Description">
                            <textarea
                                style={{ ...inputStyle(), resize: "vertical", minHeight: 60 }}
                                value={editItem.description || ""}
                                onChange={e =>
                                    setEditItem(p => ({ ...p, description: e.target.value }))
                                }
                                placeholder="Enter item description"
                            />
                        </FormGroup>
                        <FormGroup label="Icon (emoji)">
                            <input style={inputStyle()} value={editItem.imageUrl || '☕'} onChange={e => setEditItem(p => ({ ...p, imageUrl: e.target.value || '☕' }))} />
                        </FormGroup>
                    </div>
                    <FormGroup label="Ingredients (track stock per order)">
                        <p style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.5)', marginBottom: 8 }}>Stock is deducted from inventory when orders are placed.</p>
                        {(editItem.recipe || []).map((r, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                                <select
                                    style={{ ...selectStyle(), flex: 1 }}
                                    value={(r.inventoryItemId && r.inventoryItemId._id ? r.inventoryItemId._id : r.inventoryItemId) || ''}
                                    onChange={e => setEditItem(p => ({
                                        ...p,
                                        recipe: (p.recipe || []).map((x, i) => i === idx ? { ...x, inventoryItemId: e.target.value } : x),
                                    }))}
                                >
                                    <option value="">Select ingredient</option>
                                    {inventory.map((inv) => (
                                        <option key={inv._id} value={inv._id}>{inv.name} ({inv.detail})</option>
                                    ))}
                                </select>
                                <input
                                    style={{ ...inputStyle(), width: 80 }}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Qty/serve"
                                    value={r.quantityPerServing ?? ''}
                                    onChange={e => setEditItem(p => ({
                                        ...p,
                                        recipe: (p.recipe || []).map((x, i) => i === idx ? { ...x, quantityPerServing: e.target.value } : x),
                                    }))}
                                />
                                <Btn variant="ghost" size="sm" onClick={() => setEditItem(p => ({ ...p, recipe: (p.recipe || []).filter((_, i) => i !== idx) }))}>Remove</Btn>
                            </div>
                        ))}
                        <Btn variant="ghost" size="sm" onClick={() => setEditItem(p => ({ ...p, recipe: [...(p.recipe || []), { inventoryItemId: '', quantityPerServing: '' }] }))}>+ Add ingredient</Btn>
                    </FormGroup>

                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
                        <Btn variant="ghost" onClick={() => setEditItem(null)}>Cancel</Btn>
                        <Btn variant="primary" onClick={handleEdit}>Save Changes</Btn>
                    </div>

                </>}
            </Modal>
        </div>
    );
}
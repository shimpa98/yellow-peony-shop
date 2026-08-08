import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import './AdminProducts.css'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const [productsData, categoriesData] = await Promise.all([
        supabase.from('products').select('*, categories(*)').order('name'),
        supabase.from('categories').select('*').order('sort_order'),
      ])
      setProducts(productsData.data || [])
      setCategories(categoriesData.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(product) {
    try {
      if (product.id) {
        await supabase.from('products').update({
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.category_id,
          image_url: product.image_url,
          in_stock: product.in_stock,
          is_available_for_order: product.is_available_for_order,
          price_options: product.price_options,
        }).eq('id', product.id)
      } else {
        await supabase.from('products').insert([{
          name: product.name,
          description: product.description,
          price: product.price,
          category_id: product.category_id,
          image_url: product.image_url,
          in_stock: product.in_stock,
          is_available_for_order: product.is_available_for_order,
          price_options: product.price_options,
        }])
      }
      setShowModal(false)
      setEditingProduct(null)
      loadData()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Ошибка сохранения')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить товар?')) return
    try {
      await supabase.from('products').delete().eq('id', id)
      loadData()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка удаления')
    }
  }

  function openModal(product = null) {
    setEditingProduct(product || {
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      in_stock: true,
      is_available_for_order: true,
      price_options: [],
    })
    setShowModal(true)
  }

  if (loading) return <div className="admin-products">Загрузка...</div>

  return (
    <div className="admin-products">
      <header className="admin-header">
        <h1>Управление товарами</h1>
        <button onClick={() => navigate('/admin')} className="btn-back">Назад</button>
      </header>

      <button onClick={() => openModal()} className="btn-add">Добавить товар</button>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Наличие</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.categories?.name || '-'}</td>
                <td>{product.price || '-'}</td>
                <td>
                  {product.in_stock ? '✓' : '✗'}
                  {product.is_available_for_order ? '' : ' (бронь)'}
                </td>
                <td>
                  <button onClick={() => openModal(product)}>Редактировать</button>
                  <button onClick={() => handleDelete(product.id)} className="btn-delete">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

function ProductModal({ product, categories, onSave, onClose }) {
  const [form, setForm] = useState({ ...product })
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw uploadError
      }

      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      setForm({ ...form, image_url: data.publicUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(`Ошибка загрузки фото: ${error.message}`)
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{product.id ? 'Редактировать товар' : 'Добавить товар'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Название *
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Описание
            <textarea
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
            />
          </label>
          <label>
            Категория
            <select
              value={form.category_id || ''}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </label>
          <label>
            Базовая цена (если нет опций)
            <input
              type="number"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || null })}
            />
          </label>
          <label>
            Опции цены
            <div className="price-options-editor">
              {(form.price_options || []).map((opt, index) => (
                <div key={index} className="price-option-row">
                  <input
                    type="text"
                    placeholder="Название"
                    value={opt.label || opt.name || ''}
                    onChange={(e) => {
                      const newOptions = [...(form.price_options || [])]
                      newOptions[index] = { ...newOptions[index], label: e.target.value }
                      setForm({ ...form, price_options: newOptions })
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Цена"
                    value={opt.price || ''}
                    onChange={(e) => {
                      const newOptions = [...(form.price_options || [])]
                      newOptions[index] = { ...newOptions[index], price: parseFloat(e.target.value) || null }
                      setForm({ ...form, price_options: newOptions })
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Описание"
                    value={opt.description || ''}
                    onChange={(e) => {
                      const newOptions = [...(form.price_options || [])]
                      newOptions[index] = { ...newOptions[index], description: e.target.value }
                      setForm({ ...form, price_options: newOptions })
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = (form.price_options || []).filter((_, i) => i !== index)
                      setForm({ ...form, price_options: newOptions })
                    }}
                    className="btn-remove-option"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newOptions = [...(form.price_options || []), { label: '', price: null, description: '' }]
                  setForm({ ...form, price_options: newOptions })
                }}
                className="btn-add-option"
              >
                + Добавить опцию
              </button>
            </div>
          </label>
          <label>
            Фото
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <span className="uploading">Загрузка...</span>}
          </label>
          {form.image_url && (
            <div className="image-preview">
              <img src={form.image_url} alt="Preview" />
            </div>
          )}
          <label>
            URL изображения (опционально)
            <input
              value={form.image_url || ''}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://..."
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
            />
            В наличии
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.is_available_for_order}
              onChange={(e) => setForm({ ...form, is_available_for_order: e.target.checked })}
            />
            Доступен для заказа
          </label>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
  )
}

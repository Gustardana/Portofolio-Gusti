import { useEffect, useState } from 'react'
import { supabase } from "../../supabase";
import { Award, Upload, Trash2, ImageIcon, Plus } from 'lucide-react'

const Card = ({ children, className = '' }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-[#030014]/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
)

const SkeletonCard = () => (
  <div className="relative">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-2xl blur opacity-10" />
    <div className="relative bg-[#030014]/5 border border-white/12 rounded-2xl overflow-hidden">
      <div className="w-full aspect-[16/11.5] bg-[#030014]/5 animate-pulse" />
    </div>
  </div>
)

const CertCard = ({ cert, onDelete }) => {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-2xl blur opacity-10 group-hover:opacity-30 transition duration-500" />
      <div className="relative bg-[#030014]/5 border border-white/12 rounded-2xl overflow-hidden flex flex-col h-full">
        {/* Skeleton shown until image loads */}
        {!imgLoaded && (
          <div className="w-full aspect-[16/11.5] bg-[#030014]/5 animate-pulse" />
        )}
        
        {/* Gambar diubah dari object-cover menjadi object-contain dan diberi background gelap agar rapi */}
        <div className="relative w-full aspect-[16/11.5] bg-[#030014]/80 p-2 overflow-hidden flex items-center justify-center">
          <img
            src={cert.Img}
            alt="Certificate"
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'block' : 'hidden'}`}
          />
          
          {/* Badge Kategori untuk Admin */}
          {imgLoaded && cert.category && (
            <span className={`absolute top-2 left-2 px-2 py-1 text-[10px] font-medium rounded-md text-white backdrop-blur-md ${
              cert.category === 'Competition' ? 'bg-amber-500/70 border border-amber-500/50' : 'bg-[#00F2FE]/20 border border-[#00F2FE]/30 text-[#00F2FE]'
            }`}>
              {cert.category}
            </span>
          )}
        </div>

        {imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 z-10">
            <button
              onClick={() => onDelete(cert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-xs w-full justify-center hover:bg-red-500/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Certificates() {
  const [certs, setCerts] = useState([])
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [category, setCategory] = useState('Course') // State kategori default
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchCerts = async () => {
    setLoading(true)
    const { data } = await supabase.from('certificates').select('*').order('created_at', { ascending: false })
    setCerts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchCerts() }, [])

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const uploadImage = async () => {
    if (!file) return
    setUploading(true)
    const fileName = `cert-${Date.now()}-${file.name}`
    await supabase.storage.from('certificate-images').upload(fileName, file)
    const { data } = supabase.storage.from('certificate-images').getPublicUrl(fileName)
    
    // Insert menyertakan nilai category ke Supabase
    await supabase.from('certificates').insert({ Img: data.publicUrl, category: category })
    
    setFile(null); setPreview(null); setUploading(false)
    fetchCerts()
  }

  const deleteCert = async (id) => {
    if (!confirm('Delete this certificate?')) return
    await supabase.from('certificates').delete().eq('id', id)
    fetchCerts()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
            {/* Ubah warna ikon ke Cyber-Blue */}
            <Award className="w-4 h-4 text-[#00F2FE]" />
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Certificates</h1>
          <p className="text-gray-400 text-xs mt-1">Validated expertise across the digital stack.</p>
          <p className="text-gray-500 text-[10px]">
            {loading ? 'Loading...' : `${certs.length} records total`}
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <Card>
        <div className="p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#00F2FE]" /> Upload Certificate
          </h2>

          {/* Form Kategori */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#030014]/20 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-[#00F2FE] transition-colors appearance-none cursor-pointer hover:border-white/20"
            >
              <option value="Course" className="bg-[#0a0a1a]">Course</option>
              <option value="Competition" className="bg-[#0a0a1a]">Competition</option>
            </select>
          </div>

          <label
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }}
            className={`flex flex-col items-center justify-center w-full min-h-[160px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver ? 'border-[#00F2FE]/60 bg-[#00F2FE]/10' : 'border-white/12 bg-[#030014]/4 hover:border-[#00F2FE]/35 hover:bg-[#030014]/7'
            }`}
          >
            {preview ? (
              <img src={preview} alt="preview" className="max-h-40 object-contain rounded-lg p-2" />
            ) : (
              <div className="text-center space-y-2 p-6">
                <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-5 h-5 text-[#00F2FE]" />
                </div>
                <p className="text-sm text-gray-300">Drag & drop or click to upload</p>
                <p className="text-xs text-gray-600">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} className="hidden" />
          </label>

          {file && (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-gray-400 truncate flex-1">{file.name}</p>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => { setFile(null); setPreview(null) }}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-gray-500 hover:text-white text-xs transition-colors">
                  Clear
                </button>
                <button onClick={uploadImage} disabled={uploading} className="relative group/u">
                  {/* Ubah gradien hover upload ke Cyber-Blue */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-xl opacity-60 blur group-hover/u:opacity-100 transition duration-300" />
                  <div className="relative flex items-center gap-2 px-4 py-1.5 bg-[#030014] rounded-xl border border-white/10">
                    {uploading ? <div className="w-3.5 h-3.5 border-2 border-[#00F2FE]/20 border-t-[#00F2FE] rounded-full animate-spin" /> : <Upload className="w-3.5 h-3.5 text-[#00F2FE]" />}
                    <span className="text-xs text-gray-200">{uploading ? 'Uploading...' : 'Upload'}</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <Card>
          <div className="p-16 text-center">
            <Award className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No certificates yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {certs.map(cert => (
            <CertCard key={cert.id} cert={cert} onDelete={deleteCert} />
          ))}
        </div>
      )}
    </div>
  )
}
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { Briefcase, Upload, Trash2, ImageIcon, Plus, Link as LinkIcon, ExternalLink } from 'lucide-react'

const Card = ({ children, className = '' }) => (
    <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
        <div className="relative bg-[#030014]/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
            {children}
        </div>
    </div>
)

const SkeletonCard = () => (
    <div className="relative h-24">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-2xl blur opacity-10" />
        <div className="relative bg-[#030014]/5 border border-white/12 rounded-2xl overflow-hidden h-full animate-pulse" />
    </div>
)

export default function Experience() {
    const [experiences, setExperiences] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    // Form State
    const [title, setTitle] = useState('')
    const [source, setSource] = useState('')
    const [url, setUrl] = useState('')
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)

    const fetchExperiences = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('experiences')
            .select('*')
            .order('created_at', { ascending: false })
        setExperiences(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchExperiences() }, [])

    const handleFile = (e) => {
        const f = e.target.files[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file || !title || !source || !url) return alert('Harap isi semua data dan gambar!')

        setUploading(true)

        // 1. Upload Image
        const fileName = `exp-${Date.now()}-${file.name}`
        // Ubah bagian uploadError di dalam handleSubmit
        const { error: uploadError } = await supabase.storage
            .from('experience-images')
            .upload(fileName, file)

        if (uploadError) {
            console.error("Detail Error Supabase:", uploadError); // Tambahkan ini
            alert(`Gagal upload gambar: ${uploadError.message}`); // Tambahkan detail error
            setUploading(false);
            return;
        }

        // 2. Get Image URL
        const { data: imgData } = supabase.storage
            .from('experience-images')
            .getPublicUrl(fileName)

        // 3. Insert into Database
        const { error: dbError } = await supabase
            .from('experiences')
            .insert({
                title,
                source,
                url,
                image_url: imgData.publicUrl
            })

        if (!dbError) {
            // Reset Form
            setTitle(''); setSource(''); setUrl(''); setFile(null); setPreview(null)
            fetchExperiences()
        } else {
            alert('Gagal menyimpan data')
        }

        setUploading(false)
    }

    const deleteExperience = async (id) => {
        if (!confirm('Hapus liputan ini?')) return
        await supabase.from('experiences').delete().eq('id', id)
        fetchExperiences()
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4FACFE] to-[#00F2FE] rounded-xl blur opacity-50" />
                    <div className="relative w-9 h-9 bg-[#030014] rounded-xl border border-white/15 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Experience & Coverage</h1>
                    <p className="text-gray-500 text-xs">
                        {loading ? 'Loading...' : `${experiences.length} articles total`}
                    </p>
                </div>
            </div>

            {/* Upload Form Card */}
            <Card>
                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                        <Plus className="w-4 h-4 text-indigo-400" /> Tambah Liputan / Pengalaman
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Judul Liputan</label>
                                <input
                                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Contoh: Liputan P2MW PAK RT"
                                    className="w-full bg-[#030014]/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Sumber / Platform</label>
                                <input
                                    type="text" required value={source} onChange={(e) => setSource(e.target.value)}
                                    placeholder="Contoh: Instagram Univ Royal / YouTube"
                                    className="w-full bg-[#030014]/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Link URL</label>
                                <div className="flex items-center bg-[#030014]/5 border border-white/10 rounded-xl px-3 focus-within:border-blue-500 transition-colors">
                                    <LinkIcon className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                                    <input
                                        type="url" required value={url} onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full bg-transparent py-2 text-sm text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col h-full">
                            <label className="text-xs text-gray-400 mb-1 block">Thumbnail Gambar</label>
                            <label className={`flex-1 flex flex-col items-center justify-center w-full min-h-[120px] rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${preview ? 'border-indigo-400/60 bg-blue-500/10' : 'border-white/12 bg-[#030014]/4 hover:border-blue-500/35 hover:bg-[#030014]/7'
                                }`}>
                                {preview ? (
                                    <img src={preview} alt="preview" className="h-full max-h-28 object-contain rounded-lg p-2" />
                                ) : (
                                    <div className="text-center space-y-2 p-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                                            <ImageIcon className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <p className="text-xs text-gray-300">Pilih gambar thumbnail</p>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleFile} className="hidden" required />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-white/10 mt-4">
                        <button type="submit" disabled={uploading} className="relative group/u">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4f52c9] to-[#8644c5] rounded-xl opacity-60 blur group-hover/u:opacity-100 transition duration-300" />
                            <div className="relative flex items-center gap-2 px-5 py-2 bg-[#030014] rounded-xl border border-white/10">
                                {uploading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Upload className="w-4 h-4 text-indigo-400" />}
                                <span className="text-sm font-medium text-gray-200">{uploading ? 'Menyimpan...' : 'Simpan Liputan'}</span>
                            </div>
                        </button>
                    </div>
                </form>
            </Card>

            {/* List Experiences */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : experiences.length === 0 ? (
                <Card>
                    <div className="p-10 text-center">
                        <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Belum ada data liputan/pengalaman.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {experiences.map(exp => (
                        <div key={exp.id} className="group relative bg-[#030014]/5 border border-white/10 rounded-2xl p-4 hover:bg-[#030014]/10 transition-colors flex items-center gap-4">
                            {/* Thumbnail */}
                            <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-black/50 border border-white/10">
                                <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-blue-500/10 text-indigo-300 text-[10px] font-medium tracking-wider uppercase mb-1 border border-blue-500/20">
                                    {exp.source}
                                </span>
                                <h3 className="text-white font-medium text-sm sm:text-base truncate mb-1" title={exp.title}>{exp.title}</h3>
                                <a href={exp.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400 transition-colors truncate max-w-full">
                                    <ExternalLink className="w-3 h-3 shrink-0" /> {exp.url}
                                </a>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteExperience(exp.id)}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors shrink-0"
                                title="Hapus"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
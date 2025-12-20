import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, Briefcase, Search, Trash2, 
  ShieldCheck, Calendar, Trophy, ChevronLeft, ChevronRight, Loader2,
  MessageCircle, // <--- NOVO ÍCONE
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { API_URL } from "@/config/api"

function formatText(text?: string) {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  
  // PAGINAÇÃO
  const [users, setUsers] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const [loading, setLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadStats()
    loadUsers(1)
  }, [])

  async function loadStats() {
    const token = localStorage.getItem("upaon_token")
    if (!token) return navigate("/login")
    try {
        const res = await fetch(`${API_URL}/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.status === 403) return navigate("/")
        const data = await res.json()
        setStats(data)
    } catch (e) { console.error(e) }
  }

  async function loadUsers(currentPage: number, query = "") {
    setTableLoading(true)
    const token = localStorage.getItem("upaon_token")
    try {
        const url = `${API_URL}/admin/users?page=${currentPage}&limit=10&q=${query}`
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const responseData = await res.json()
        
        setUsers(responseData.data)
        setTotalPages(responseData.meta.lastPage)
        setTotalItems(responseData.meta.total)
        setPage(currentPage)
    } catch (error) {
        console.error("Erro ao listar usuários", error)
    } finally {
        setTableLoading(false)
        setLoading(false)
    }
  }

  async function handleToggleFeatured(providerId: string, currentStatus: boolean, userName: string) {
    const token = localStorage.getItem("upaon_token")
    // Otimistic Update
    setUsers(prev => prev.map(u => {
        if (u.provider?.id === providerId) {
            return { ...u, provider: { ...u.provider, isFeatured: !currentStatus } }
        }
        return u
    }))

    try {
        const res = await fetch(`${API_URL}/admin/providers/${providerId}/toggle-feature`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
            const formattedName = formatText(userName)
            toast.success(!currentStatus ? `${formattedName} agora é DESTAQUE!` : `${formattedName} removido dos destaques.`)
        } else {
            loadUsers(page, searchTerm)
            toast.error("Erro ao alterar destaque.")
        }
    } catch (err) {
        console.error(err)
    }
  }

  async function handleDelete(userId: string) {
    if(!confirm("Tem certeza? Essa ação é irreversível.")) return
    const token = localStorage.getItem("upaon_token")
    try {
        const res = await fetch(`${API_URL}/admin/users/${userId}/toggle-active`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
        })
        if(res.ok) {
            toast.success("Usuário deletado.")
            loadUsers(page, searchTerm)
        }
    } catch(err) { console.error(err) }
  }

  function handleSearch(e: React.KeyboardEvent) {
    if(e.key === 'Enter') {
        setPage(1)
        loadUsers(1, searchTerm)
    }
  }

  function formatDate(dateString: string) {
    if(!dateString) return "-"
    return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
  }

    function handleLogout() {
    localStorage.removeItem("upaon_token")
    localStorage.removeItem("upaon_user")
    toast.success("Você saiu da conta.")
    navigate("/")
  }


  if (loading) return <div className="h-screen flex items-center justify-center bg-zinc-950 text-white">Carregando...</div>

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      
      <div className="max-w-7xl mx-auto mt-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-2">
                <ShieldCheck className="text-green-500" /> Painel Super Admin
            </h1>
            <p className="text-zinc-400">Controle total da plataforma.</p>
        </div>
        {/* Botão Logout */}
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-white hover:text-red-500 hover:bg-red-500/10 rounded-full ml-1"
            title="Sair"
            >
            <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users /></div>
                <div>
                    <h3 className="text-3xl font-bold">{stats?.users || 0}</h3>
                    <p className="text-sm text-zinc-400">Usuários Totais</p>
                </div>
            </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Briefcase /></div>
                <div>
                    <h3 className="text-3xl font-bold">{stats?.providers || 0}</h3>
                    <p className="text-sm text-zinc-400">Prestadores Ativos</p>
                </div>
            </div>
        </div>

        {/* --- CARD ALTERADO PARA WHATSAPP --- */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                    <MessageCircle />
                </div>
                <div>
                    <h3 className="text-3xl font-bold">{stats?.totalContacts || 0}</h3>
                    <p className="text-sm text-zinc-400">Cliques no WhatsApp</p>
                </div>
            </div>
        </div>
      </div>

      {/* LISTA DE USUÁRIOS */}
      <div className="max-w-7xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
                Gerenciar Usuários 
                <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">{totalItems} total</span>
            </h2>
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <Input 
                    placeholder="Buscar..." 
                    className="pl-10 bg-zinc-950 border-zinc-700 text-zinc-200"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
        </div>

        <div className="overflow-x-auto relative min-h-[400px]">
            {tableLoading && (
                <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Loader2 className="animate-spin text-white w-8 h-8"/>
                </div>
            )}
            
            <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-200 uppercase font-medium text-xs">
                    <tr>
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Cadastro</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4 text-center">Destaque?</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-800/50 transition-colors group">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                                    {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover"/> : 
                                    <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">{u.name[0]}</div>}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-200">{formatText(u.name)}</p>
                                    <p className="text-xs text-zinc-500">{u.email}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-zinc-600" />
                                    {formatDate(u.createdAt)}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 
                                    u.role === 'PROVIDER' ? 'bg-purple-500/10 text-purple-500' : 
                                    'bg-zinc-800 text-zinc-400'
                                }`}>
                                    {u.role}
                                </span>
                            </td>
                            
                            <td className="px-6 py-4 text-center">
                                {u.role === 'PROVIDER' && u.provider ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleToggleFeatured(u.provider.id, u.provider.isFeatured, u.name)}
                                        className={`hover:bg-yellow-500/10 ${u.provider.isFeatured ? 'text-yellow-500' : 'text-zinc-600 opacity-30 hover:opacity-100'}`}
                                        title={u.provider.isFeatured ? "Remover Destaque" : "Destacar na Home"}
                                    >
                                        <Trophy className={`w-5 h-5 ${u.provider.isFeatured ? 'fill-yellow-500' : ''}`} />
                                    </Button>
                                ) : (
                                    <span className="text-zinc-700">-</span>
                                )}
                            </td>

                            <td className="px-6 py-4 text-right">
                                {u.role !== 'ADMIN' && (
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                                        onClick={() => handleDelete(u.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-900">
            <span className="md:text-sm text-xs text-zinc-500">
                Página {page} de {totalPages}
            </span>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadUsers(page - 1, searchTerm)}
                    disabled={page === 1}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => loadUsers(page + 1, searchTerm)}
                    disabled={page >= totalPages}
                    className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                    Próximo <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>

      </div>
    </div>
  )
}
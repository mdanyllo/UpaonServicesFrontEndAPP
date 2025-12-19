import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  Users, Briefcase, Activity, Search, Trash2, 
  ShieldAlert, ShieldCheck, LayoutDashboard 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { API_URL } from "@/config/api"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const token = localStorage.getItem("upaon_token")
    if (!token) return navigate("/login")

    try {
      // 1. Busca estatísticas
      const statsRes = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (statsRes.status === 403) {
        toast.error("Sai daqui! Você não é Admin.")
        navigate("/dashboard/prestador")
        return
      }

      const statsData = await statsRes.json()
      setStats(statsData)

      // 2. Busca lista de usuários
      loadUsers(token)

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function loadUsers(token: string, query = "") {
    const url = query ? `${API_URL}/admin/users?q=${query}` : `${API_URL}/admin/users`
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setUsers(data)
  }

  async function handleDelete(userId: string) {
    if(!confirm("Tem certeza? Isso vai apagar o usuário para sempre!")) return

    const token = localStorage.getItem("upaon_token")
    try {
        const res = await fetch(`${API_URL}/admin/users/${userId}/toggle-active`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` }
        })

        if(res.ok) {
            toast.success("Usuário removido do sistema.")
            loadUsers(token!) // Recarrega a lista
        } else {
            toast.error("Erro ao remover.")
        }
    } catch(err) {
        console.error(err)
    }
  }

  function handleSearch(e: React.KeyboardEvent) {
    if(e.key === 'Enter') {
        const token = localStorage.getItem("upaon_token")
        loadUsers(token!, searchTerm)
    }
  }

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Carregando Painel da NASA...</div>

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-display flex items-center gap-2">
                <ShieldCheck className="text-green-500" /> Painel Super Admin
            </h1>
            <p className="text-zinc-400">Visão geral do império Upaon Services.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/")}>Voltar pro Site</Button>
      </div>

      {/* STATS CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users /></div>
                <div>
                    <h3 className="text-2xl font-bold">{stats?.users}</h3>
                    <p className="text-sm text-zinc-400">Usuários Totais</p>
                </div>
            </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500"><Briefcase /></div>
                <div>
                    <h3 className="text-2xl font-bold">{stats?.providers}</h3>
                    <p className="text-sm text-zinc-400">Prestadores Ativos</p>
                </div>
            </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><Activity /></div>
                <div>
                    <h3 className="text-2xl font-bold">{stats?.impressions}</h3>
                    <p className="text-sm text-zinc-400">Visualizações em Perfis</p>
                </div>
            </div>
        </div>
      </div>

      {/* USER MANAGEMENT */}
      <div className="max-w-7xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col md:flex-row justify-between gap-4">
            <h2 className="text-xl font-bold">Gerenciar Usuários</h2>
            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <Input 
                    placeholder="Buscar nome ou email..." 
                    className="pl-10 bg-zinc-950 border-zinc-700"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-200 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {users.map((u) => (
                        <tr key={u.id} className="hover:bg-zinc-800/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden">
                                    {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center font-bold text-zinc-500">{u.name[0]}</div>}
                                </div>
                                <div>
                                    <p className="font-bold text-zinc-200">{u.name}</p>
                                    <p className="text-xs">{u.email}</p>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    u.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 
                                    u.role === 'PROVIDER' ? 'bg-purple-500/10 text-purple-500' : 
                                    'bg-zinc-700/50 text-zinc-300'
                                }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-green-500 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Ativo
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                {u.role !== 'ADMIN' && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
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
      </div>

    </div>
  )
}
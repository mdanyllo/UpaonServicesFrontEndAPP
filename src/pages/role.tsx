import { useNavigate } from "react-router-dom"

export function Cadastro() {
  const navigate = useNavigate()

function handleChoose(path: "/cadastro/cliente" | "/cadastro/prestador") {
  navigate(path)
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-sunset from-orange-50 to-orange-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">
            Como você deseja usar a {""}
            <span className="text-gradient-hero">UpaonServices</span>?
          </h1>
          <p className="text-gray-500">
            Escolha a opção que melhor representa você
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Usuário */}
          <div
            className="cursor-pointer border rounded-2xl p-6 text-center space-y-4 hover:shadow-lg hover:border-orange-400 transition"
          >
            <div className="text-5xl">👤</div>
            <h2 className="text-xl font-semibold">Usuário</h2>
            <p className="text-gray-500 text-sm">
              Quero contratar serviços de profissionais locais
            </p>

            <button onClick={() => handleChoose("/cadastro/cliente")} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold">
              Sou Usuário
            </button>
          </div>

          {/* Prestador */}
          <div
            className="cursor-pointer border rounded-2xl p-6 text-center space-y-4 hover:shadow-lg hover:border-green-400 transition"
          >
            <div className="text-5xl">🛠️</div>
            <h2 className="text-xl font-semibold">Prestador de Serviço</h2>
            <p className="text-gray-500 text-sm">
              Quero oferecer meus serviços e conseguir clientes
            </p>

            <button onClick={() => handleChoose("/cadastro/prestador")} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold">
              Sou Prestador
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

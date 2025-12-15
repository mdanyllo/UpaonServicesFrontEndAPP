import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

const categories = [
  "Tecnologia",
  "Reparos",
  "Limpeza",
  "Pintura",
  "Construção",
  "Beleza",
  "Babá",
  "Cuidadores",
  "Culinária",
  "Mudança",
  "Fotografia",
  "Motoristas",
  "Outros",
]

export function Prestador() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [category, setCategory] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    const finalCategory =
      category === "Outros"
        ? (formData.get("customCategory") as string)
        : category

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      phone: formData.get("phone") as string,
      description: formData.get("description") as string,
      category: finalCategory,
      role: "PROVIDER",
    }

    try {
      const res = await fetch(
        "https://upaonservicesbackprototipo.onrender.com/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      )

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Erro ao criar conta")
      }

      alert("Conta de prestador criada com sucesso")
      navigate("/")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-sunset px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sun/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-large p-8 space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Criar conta na{" "}
            <span className="text-gradient-hero">UpaonServices</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Cadastre-se como prestador de serviços
          </p>
        </div>

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Nome completo"
            required
            className="rounded-xl"
          />

          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-xl"
          />

          <Input
            name="phone"
            placeholder="Telefone (opcional)"
            className="rounded-xl"
          />

          {/* SELECT DE CATEGORIA */}
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Selecione sua categoria</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* INPUT EXTRA SE FOR "OUTROS" */}
          {category === "Outros" && (
            <Input
              name="customCategory"
              placeholder="Descreva sua categoria"
              required
              className="rounded-xl"
            />
          )}

          <Input
            name="description"
            placeholder="Descreva seus serviços"
            className="rounded-xl"
          />

          <Input
            name="password"
            type="password"
            placeholder="Senha"
            required
            className="rounded-xl"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Criando conta..." : "Cadastrar como prestador"}
        </Button>
      </form>
    </section>
  )
}

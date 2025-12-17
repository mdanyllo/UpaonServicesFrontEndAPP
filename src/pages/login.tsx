import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
      useEffect(() => {
        const storedUser = localStorage.getItem("upaon_user")
        const storedToken = localStorage.getItem("upaon_token")
    
        if (storedUser && storedToken) {
          const user = JSON.parse(storedUser)
          
          // Redireciona imediatamente baseado no tipo de usuário
          if (user.role === "PROVIDER") {
            navigate("/dashboard/prestador", { replace: true })
          } else {
            navigate("/dashboard/cliente", { replace: true })
          }
        }
      }, [navigate])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const loginPayload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const res = await fetch(
        "http://localhost:3333/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload),
        }
      );

      const data: any = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Erro ao fazer login");
      }

      localStorage.setItem("upaon_token", data.token)
      localStorage.setItem("upaon_user", JSON.stringify(data.user))

      if (data.user.role === "PROVIDER") {
        navigate("/dashboard/prestador")
      } else {
        navigate("/dashboard/cliente")
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-sunset px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-sun/10 rounded-full blur-3xl animate-pulse-soft" />
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-card/90 backdrop-blur-sm border border-border rounded-2xl shadow-large p-8 space-y-6 animate-fade-in"
      >
        <div className="text-center">
          <h1 className="font-display font-bold text-3xl text-foreground">
            Entrar na{" "}
            <span className="text-gradient-hero">UpaonServices</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Conecte-se com profissionais de confiança perto de você
          </p>
        </div>

        <div className="space-y-4">
          <Input
            name="email"
            type="email"
            placeholder="Email"
            required
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
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Não tem uma conta?{" "}
          <Link className="text-primary font-medium hover:underline" to="/cadastro">
            Cadastre-se
          </Link>
        </p>
      </form>
    </section>
  );
}

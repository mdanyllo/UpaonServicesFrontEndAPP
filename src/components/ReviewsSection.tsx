import { useState, useEffect } from "react"
import { Star, User, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner" // Usando o Sonner para avisos bonitos

type Review = {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  author: {
    name: string
    avatarUrl: string | null
  }
}

interface ReviewsSectionProps {
  providerId: string
}

export function ReviewsSection({ providerId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estado do Formulário
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 1. Carregar Avaliações
  useEffect(() => {
    fetchReviews()
  }, [providerId])

  async function fetchReviews() {
    try {
      const res = await fetch(`https://upaonservicesbackprototipo.onrender.com/reviews/${providerId}`)
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erro ao carregar reviews")
    } finally {
      setLoading(false)
    }
  }

  // 2. Enviar Avaliação
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const token = localStorage.getItem("upaon_token")
    if (!token) {
      toast.error("Faça login para avaliar!")
      return
    }

    if (rating === 0) {
      toast.warning("Selecione uma nota de 1 a 5 estrelas.")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("https://upaonservicesbackprototipo.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ providerId, rating, comment })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Erro ao avaliar.")
      }

      toast.success("Avaliação enviada com sucesso!")
      setComment("")
      setRating(0)
      fetchReviews() // Recarrega a lista para mostrar a nova
      
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-10 pt-10 border-t border-border">
      <h3 className="text-2xl font-display font-bold mb-6">Avaliações e Comentários</h3>

      {/* FORMULÁRIO DE AVALIAÇÃO */}
      <div className="bg-background p-6 rounded-2xl mb-10 border border-border">
        <h4 className="font-semibold mb-4">Deixe sua avaliação</h4>
        
        {/* Estrelas Interativas */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                }`} 
              />
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea 
            placeholder="Conte como foi sua experiência com este profissional..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-muted/20 min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
              Enviar Avaliação
            </Button>
          </div>
        </form>
      </div>

      {/* LISTA DE AVALIAÇÕES */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-10"><Loader2 className="animate-spin mx-auto"/></div>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">Este profissional ainda não tem avaliações. Seja o primeiro!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-4 rounded-xl bg-card border border-border">
              {/* Avatar do Autor */}
              <div className="flex-shrink-0">
                {review.author.avatarUrl ? (
                  <img src={review.author.avatarUrl} alt={review.author.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 opacity-50" />
                  </div>
                )}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{review.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3 h-3 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                    />
                  ))}
                </div>

                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
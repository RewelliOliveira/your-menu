import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export function NotFoundPage({ message = "A página que você procura não existe ou foi movida." }: { message?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <EmptyState
        icon={SearchX}
        title="Página não encontrada"
        description={message}
        action={
          <Button asChild variant="outline">
            <Link to="/">Ir para o início</Link>
          </Button>
        }
      />
    </div>
  );
}

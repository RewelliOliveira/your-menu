import { RotateCw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <EmptyState
      icon={TriangleAlert}
      title="Não foi possível carregar"
      description={getErrorMessage(error)}
      action={
        onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RotateCw /> Tentar novamente
          </Button>
        )
      }
    />
  );
}

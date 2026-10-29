import { useEffect, useRef, useState } from "react";

import { lookupCep, type CepResult } from "@/lib/cep";
import { onlyDigits } from "@/lib/format";

export function useCepAutofill(cep: string, onFound: (result: CepResult) => void) {
  const [loading, setLoading] = useState(false);
  const onFoundRef = useRef(onFound);
  const digits = onlyDigits(cep);
  const initialDigits = useRef(digits);

  useEffect(() => {
    onFoundRef.current = onFound;
  });

  useEffect(() => {
    if (digits.length !== 8 || digits === initialDigits.current) return;
    const controller = new AbortController();
    setLoading(true);
    lookupCep(digits, controller.signal)
      .then((result) => result && onFoundRef.current(result))
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [digits]);

  return loading;
}

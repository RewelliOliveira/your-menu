import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Banknote, Bike, CreditCard, Loader2, QrCode, ShoppingBag, Store } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import { CurrencyInput } from "@/components/shared/CurrencyInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { Field } from "@/components/shared/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCepAutofill } from "@/hooks/use-cep-autofill";
import { formatCurrency, maskCep, maskPhone, normalizeText, onlyDigits, parseCurrency } from "@/lib/format";
import { notifyError } from "@/lib/notify";
import { createOrder } from "@/services/order-service";
import type { FulfillmentType, PaymentMethod } from "@/types/order";
import { useCart } from "../cart/cart-context";
import { useStorefront } from "../storefront-context";
import { OptionCard } from "./OptionCard";

interface CheckoutForm {
  fulfillment: FulfillmentType;
  name: string;
  phone: string;
  cep: string;
  zoneId: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  paymentMethod: PaymentMethod | "";
  needsChange: boolean;
  changeFor: string;
  note: string;
}

type Errors = Partial<Record<keyof CheckoutForm, string>>;

export function CheckoutPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { restaurant, zones } = useStorefront();
  const { lines, subtotal, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<CheckoutForm>({
    fulfillment: zones.length || !restaurant.pickupEnabled ? "DELIVERY" : "PICKUP",
    name: "",
    phone: "",
    cep: "",
    zoneId: "",
    street: "",
    number: "",
    complement: "",
    reference: "",
    paymentMethod: "",
    needsChange: false,
    changeFor: "",
    note: "",
  });

  const set = <K extends keyof CheckoutForm>(field: K, value: CheckoutForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const searchingCep = useCepAutofill(form.cep, (result) => {
    const matchedZone = zones.find((zone) => normalizeText(zone.name) === normalizeText(result.district));
    setForm((prev) => ({
      ...prev,
      street: result.street || prev.street,
      zoneId: matchedZone?.id ?? prev.zoneId,
    }));
  });

  const isDelivery = form.fulfillment === "DELIVERY";
  const zone = zones.find((z) => z.id === form.zoneId);
  const deliveryFee = isDelivery ? (zone?.fee ?? 0) : 0;
  const total = subtotal + deliveryFee;

  if (lines.length === 0) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-4">
        <EmptyState
          icon={ShoppingBag}
          title="Sua sacola está vazia"
          description="Escolha seus itens no cardápio para continuar."
          action={
            <Button asChild>
              <Link to={`/${slug}`}>Ver cardápio</Link>
            </Button>
          }
        />
      </div>
    );
  }

  function validate() {
    const next: Errors = {};
    if (form.name.trim().length < 2) next.name = "Informe seu nome.";
    const phoneDigits = onlyDigits(form.phone).length;
    if (phoneDigits < 10 || phoneDigits > 11) next.phone = "Informe um celular com DDD.";
    if (isDelivery) {
      if (onlyDigits(form.cep).length !== 8) next.cep = "CEP inválido.";
      if (!form.zoneId) next.zoneId = "Selecione o bairro.";
      if (!form.street.trim()) next.street = "Informe a rua.";
      if (!form.number.trim()) next.number = "Informe o número.";
    }
    if (!form.paymentMethod) next.paymentMethod = "Escolha como vai pagar.";
    if (form.paymentMethod === "CASH" && form.needsChange && parseCurrency(form.changeFor) < total) {
      next.changeFor = `O troco deve ser para um valor acima de ${formatCurrency(total)}.`;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) {
      toast.error("Confira os campos destacados.");
      return;
    }

    setSubmitting(true);
    try {
      const order = await createOrder(slug, {
        fulfillment: form.fulfillment,
        customer: { name: form.name, phone: form.phone },
        address: isDelivery
          ? {
              zoneId: form.zoneId,
              cep: form.cep,
              street: form.street,
              number: form.number,
              complement: form.complement,
              reference: form.reference,
            }
          : null,
        paymentMethod: form.paymentMethod as PaymentMethod,
        changeFor: form.paymentMethod === "CASH" && form.needsChange ? parseCurrency(form.changeFor) : null,
        note: form.note,
        items: lines.map(({ dishId, variantId, quantity, note }) => ({ dishId, variantId, quantity, note })),
      });
      clear();
      navigate(`/${slug}/pedido/${order.trackingCode}`, { replace: true });
    } catch (error) {
      notifyError(error, "Não foi possível enviar o pedido.");
      setSubmitting(false);
    }
  }

  const submitLabel = restaurant.isOpen ? `Fazer pedido · ${formatCurrency(total)}` : "Loja fechada no momento";

  return (
    <div className="min-h-dvh pb-32 lg:pb-12">
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/${slug}`} aria-label="Voltar ao cardápio">
              <ArrowLeft />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="font-extrabold">Finalizar pedido</h1>
            <p className="truncate text-xs text-muted-foreground">{restaurant.name}</p>
          </div>
        </div>
      </header>

      <form
        id="checkout-form"
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto grid max-w-5xl items-start gap-6 px-4 pt-6 lg:grid-cols-[1fr_22rem]"
      >
        <div className="space-y-5">
          <Step number={1} title="Como você quer receber?">
            <RadioGroup
              value={form.fulfillment}
              onValueChange={(value) => set("fulfillment", value as FulfillmentType)}
              className="sm:grid-cols-2"
            >
              {zones.length > 0 && (
                <OptionCard
                  value="DELIVERY"
                  selected={form.fulfillment === "DELIVERY"}
                  icon={Bike}
                  title="Entrega"
                  description={`${restaurant.deliveryTimeMin}–${restaurant.deliveryTimeMax} min`}
                />
              )}
              {restaurant.pickupEnabled && (
                <OptionCard
                  value="PICKUP"
                  selected={form.fulfillment === "PICKUP"}
                  icon={Store}
                  title="Retirar na loja"
                  description="Sem taxa de entrega"
                />
              )}
            </RadioGroup>
          </Step>

          <Step number={2} title="Seus dados">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome" htmlFor="name" error={errors.name} required>
                <Input
                  id="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  maxLength={80}
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Celular (WhatsApp)" htmlFor="phone" error={errors.phone} required>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel-national"
                  placeholder="(11) 99999-9999"
                  value={form.phone}
                  onChange={(e) => set("phone", maskPhone(e.target.value))}
                  aria-invalid={!!errors.phone}
                />
              </Field>
            </div>
          </Step>

          <AnimatePresence initial={false}>
            {isDelivery && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Step number={3} title="Endereço de entrega">
                  <div className="grid gap-4 sm:grid-cols-6">
                    <Field label="CEP" htmlFor="cep" error={errors.cep} className="sm:col-span-2" required>
                      <div className="relative">
                        <Input
                          id="cep"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          placeholder="00000-000"
                          value={form.cep}
                          onChange={(e) => set("cep", maskCep(e.target.value))}
                          aria-invalid={!!errors.cep}
                        />
                        {searchingCep && (
                          <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </Field>
                    <Field label="Bairro" error={errors.zoneId} className="sm:col-span-4" required>
                      <Select value={form.zoneId} onValueChange={(value) => set("zoneId", value)}>
                        <SelectTrigger aria-invalid={!!errors.zoneId} aria-label="Bairro">
                          <SelectValue placeholder="Selecione seu bairro" />
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((z) => (
                            <SelectItem key={z.id} value={z.id}>
                              {z.name} · {z.fee ? formatCurrency(z.fee) : "Grátis"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Rua" htmlFor="street" error={errors.street} className="sm:col-span-4" required>
                      <Input
                        id="street"
                        autoComplete="address-line1"
                        value={form.street}
                        onChange={(e) => set("street", e.target.value)}
                        maxLength={120}
                        aria-invalid={!!errors.street}
                      />
                    </Field>
                    <Field label="Número" htmlFor="number" error={errors.number} className="sm:col-span-2" required>
                      <Input
                        id="number"
                        value={form.number}
                        onChange={(e) => set("number", e.target.value)}
                        maxLength={10}
                        aria-invalid={!!errors.number}
                      />
                    </Field>
                    <Field label="Complemento" htmlFor="complement" className="sm:col-span-3">
                      <Input
                        id="complement"
                        autoComplete="address-line2"
                        placeholder="Apto, bloco…"
                        value={form.complement}
                        onChange={(e) => set("complement", e.target.value)}
                        maxLength={60}
                      />
                    </Field>
                    <Field label="Ponto de referência" htmlFor="reference" className="sm:col-span-3">
                      <Input
                        id="reference"
                        value={form.reference}
                        onChange={(e) => set("reference", e.target.value)}
                        maxLength={120}
                      />
                    </Field>
                  </div>
                </Step>
              </motion.div>
            )}
          </AnimatePresence>

          <Step number={isDelivery ? 4 : 3} title="Pagamento" error={errors.paymentMethod}>
            <RadioGroup value={form.paymentMethod} onValueChange={(value) => set("paymentMethod", value as PaymentMethod)}>
              {restaurant.pixKey && (
                <OptionCard
                  value="PIX"
                  selected={form.paymentMethod === "PIX"}
                  icon={QrCode}
                  title="Pix"
                  description="Pague pelo app do banco após enviar o pedido"
                />
              )}
              <OptionCard
                value="CARD"
                selected={form.paymentMethod === "CARD"}
                icon={CreditCard}
                title="Cartão"
                description={isDelivery ? "Crédito ou débito na entrega" : "Crédito ou débito na retirada"}
              />
              <OptionCard value="CASH" selected={form.paymentMethod === "CASH"} icon={Banknote} title="Dinheiro" />
            </RadioGroup>

            <AnimatePresence initial={false}>
              {form.paymentMethod === "CASH" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3 rounded-2xl bg-muted/60 p-4">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={form.needsChange}
                        onChange={(e) => set("needsChange", e.target.checked)}
                        className="size-4 accent-primary"
                      />
                      Preciso de troco
                    </label>
                    {form.needsChange && (
                      <Field label="Troco para quanto?" htmlFor="change" error={errors.changeFor}>
                        <CurrencyInput id="change" value={form.changeFor} onValueChange={(v) => set("changeFor", v)} />
                      </Field>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Step>

          <Step number={isDelivery ? 5 : 4} title="Observações" optional>
            <Textarea
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Alguma informação para o restaurante?"
              maxLength={280}
              rows={2}
              aria-label="Observações do pedido"
            />
          </Step>
        </div>

        <aside className="space-y-4 rounded-3xl border bg-card p-5 shadow-xs lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Resumo</h2>
            <Link to={`/${slug}`} className="text-xs font-semibold text-primary hover:underline">
              Adicionar itens
            </Link>
          </div>
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.key} className="flex justify-between gap-3 text-sm">
                <span className="min-w-0">
                  <span className="font-semibold">
                    <span className="text-primary">{line.quantity}x</span> {line.dish.name}
                  </span>
                  <span className="block text-xs text-muted-foreground">{line.variant.label}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums">{formatCurrency(line.total)}</span>
              </li>
            ))}
          </ul>
          <Separator />
          <div className="space-y-2 text-sm">
            <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
            <SummaryRow
              label="Taxa de entrega"
              value={!isDelivery || (zone && zone.fee === 0) ? "Grátis" : zone ? formatCurrency(zone.fee) : "Selecione o bairro"}
            />
            <div className="flex justify-between pt-1 text-lg font-extrabold">
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(total)}</span>
            </div>
          </div>
          <Button type="submit" size="lg" className="hidden w-full lg:flex" loading={submitting} disabled={!restaurant.isOpen}>
            {submitLabel}
          </Button>
        </aside>
      </form>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-20 border-t bg-card/95 px-4 pt-3 backdrop-blur-lg lg:hidden">
        <Button
          type="submit"
          form="checkout-form"
          size="lg"
          className="w-full"
          loading={submitting}
          disabled={!restaurant.isOpen}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  optional,
  error,
  children,
}: {
  number: number;
  title: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border bg-card p-5 shadow-xs">
      <h2 className="mb-4 flex items-center gap-3 font-extrabold">
        <span className="flex size-7 items-center justify-center rounded-full bg-foreground text-xs text-background">
          {number}
        </span>
        {title}
        {optional && <span className="text-xs font-medium text-muted-foreground">(opcional)</span>}
      </h2>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

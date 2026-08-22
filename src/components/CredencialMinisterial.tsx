import retrato from "@/assets/retrato-obreiro.jpg";
import { dataBR, type Congregacao, type Obreiro } from "@/lib/cinap";

export function CredencialMinisterial({
  obreiro,
  congregacao,
}: {
  obreiro: Obreiro;
  congregacao?: Congregacao | undefined;
}) {
  return (
    <div className="relative flex aspect-[1/1.58] w-[320px] flex-col items-center overflow-hidden rounded-xl border-8 border-primary/5 bg-surface p-6 text-center shadow-card">
      <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
      <div className="mt-4 size-28 overflow-hidden rounded-sm outline outline-1 outline-border">
        <img
          src={retrato}
          alt={`Retrato de ${obreiro.nome}`}
          width={512}
          height={512}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <h5 className="mt-6 font-display text-xl leading-tight">{obreiro.nome}</h5>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-primary">
        Cargo: {obreiro.cargo}
      </p>

      <div className="mt-8 w-full space-y-3 border-t border-dashed border-border pt-6">
        <Linha rotulo="Congregação" valor={congregacao?.nome ?? "Sem vínculo"} />
        <Linha rotulo="Validade" valor={dataBR(obreiro.validade)} />
        <Linha rotulo="Registro" valor={obreiro.registro} />
      </div>

      <div className="mt-auto">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-primary/20 opacity-40">
          <div className="size-8 rounded-full border-4 border-double border-primary/30" />
        </div>
        <p className="mt-2 text-[8px] uppercase tracking-tighter text-muted-foreground">
          Selo de autenticidade digital
        </p>
      </div>

      <div className="absolute -bottom-8 -right-8 size-24 rounded-full bg-primary/5" />
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex justify-between gap-3 font-mono text-[9px] uppercase">
      <span className="text-muted-foreground">{rotulo}</span>
      <span className="truncate font-bold">{valor}</span>
    </div>
  );
}

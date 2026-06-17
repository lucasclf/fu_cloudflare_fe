import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type CampaignTopbarInfo = {
  campaignId: number;
  campaignName: string;
} | null;

type CampaignTopbarContextValue = {
  info: CampaignTopbarInfo;
  setInfo: (info: CampaignTopbarInfo) => void;
};

const CampaignTopbarContext = createContext<CampaignTopbarContextValue | null>(null);

export function CampaignTopbarProvider({ children }: { children: ReactNode }) {
  const [info, setInfo] = useState<CampaignTopbarInfo>(null);

  const value = useMemo(() => ({ info, setInfo }), [info]);

  return (
    <CampaignTopbarContext.Provider value={value}>
      {children}
    </CampaignTopbarContext.Provider>
  );
}

function useCampaignTopbarContext(): CampaignTopbarContextValue {
  const context = useContext(CampaignTopbarContext);

  if (!context) {
    throw new Error("useCampaignTopbarContext deve ser usado dentro de CampaignTopbarProvider");
  }

  return context;
}

/** Usado pelo `CampaignLayout` para publicar/limpar o nome da campanha exibido na topbar. */
export function useCampaignTopbar() {
  const { setInfo } = useCampaignTopbarContext();
  return { setInfo };
}

/** Usado pelo `AppLayout` para ler as informações da campanha atual, se houver. */
export function useCampaignTopbarInfo(): CampaignTopbarInfo {
  const { info } = useCampaignTopbarContext();
  return info;
}

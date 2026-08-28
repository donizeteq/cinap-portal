export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      agent_keys: {
        Row: {
          ativa: boolean
          chave_hash: string
          created_at: string
          id: string
          nome: string
          permissoes: string[]
          ultimo_uso: string | null
        }
        Insert: {
          ativa?: boolean
          chave_hash: string
          created_at?: string
          id?: string
          nome: string
          permissoes?: string[]
          ultimo_uso?: string | null
        }
        Update: {
          ativa?: boolean
          chave_hash?: string
          created_at?: string
          id?: string
          nome?: string
          permissoes?: string[]
          ultimo_uso?: string | null
        }
        Relationships: []
      }
      auditoria: {
        Row: {
          acao: string
          created_at: string
          descricao: string
          detalhes: Json
          entidade: string
          entidade_id: string | null
          id: string
          usuario_email: string
          usuario_id: string | null
          usuario_nome: string
        }
        Insert: {
          acao: string
          created_at?: string
          descricao?: string
          detalhes?: Json
          entidade?: string
          entidade_id?: string | null
          id?: string
          usuario_email?: string
          usuario_id?: string | null
          usuario_nome?: string
        }
        Update: {
          acao?: string
          created_at?: string
          descricao?: string
          detalhes?: Json
          entidade?: string
          entidade_id?: string | null
          id?: string
          usuario_email?: string
          usuario_id?: string | null
          usuario_nome?: string
        }
        Relationships: []
      }
      auth_tentativas: {
        Row: {
          bloqueado_ate: string | null
          chave: string
          created_at: string
          id: string
          janela_inicio: string
          tentativas: number
          tipo: string
          ultima_tentativa: string
          updated_at: string
        }
        Insert: {
          bloqueado_ate?: string | null
          chave: string
          created_at?: string
          id?: string
          janela_inicio?: string
          tentativas?: number
          tipo: string
          ultima_tentativa?: string
          updated_at?: string
        }
        Update: {
          bloqueado_ate?: string | null
          chave?: string
          created_at?: string
          id?: string
          janela_inicio?: string
          tentativas?: number
          tipo?: string
          ultima_tentativa?: string
          updated_at?: string
        }
        Relationships: []
      }
      config_alertas: {
        Row: {
          assunto_atraso: string
          assunto_vencimento: string
          copia_admin: string
          corpo_atraso: string
          corpo_vencimento: string
          dia_vencimento: number
          dias_antes_aviso: number
          dominio_email: string
          emails_ativos: boolean
          id: boolean
          meses_intervalo_atraso: number
          remetente_email: string
          remetente_nome: string
          rodape_email: string
          ultima_execucao: string | null
          updated_at: string
        }
        Insert: {
          assunto_atraso?: string
          assunto_vencimento?: string
          copia_admin?: string
          corpo_atraso?: string
          corpo_vencimento?: string
          dia_vencimento?: number
          dias_antes_aviso?: number
          dominio_email?: string
          emails_ativos?: boolean
          id?: boolean
          meses_intervalo_atraso?: number
          remetente_email?: string
          remetente_nome?: string
          rodape_email?: string
          ultima_execucao?: string | null
          updated_at?: string
        }
        Update: {
          assunto_atraso?: string
          assunto_vencimento?: string
          copia_admin?: string
          corpo_atraso?: string
          corpo_vencimento?: string
          dia_vencimento?: number
          dias_antes_aviso?: number
          dominio_email?: string
          emails_ativos?: boolean
          id?: boolean
          meses_intervalo_atraso?: number
          remetente_email?: string
          remetente_nome?: string
          rodape_email?: string
          ultima_execucao?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      congregacoes: {
        Row: {
          ativa: boolean
          categoria: Database["public"]["Enums"]["categoria_congregacao"]
          cidade: string
          created_at: string
          estado: string
          id: string
          nome: string
          qdt_obreiros: number
          valor_mensalidade: number
        }
        Insert: {
          ativa?: boolean
          categoria?: Database["public"]["Enums"]["categoria_congregacao"]
          cidade?: string
          created_at?: string
          estado?: string
          id?: string
          nome: string
          qdt_obreiros?: number
          valor_mensalidade?: number
        }
        Update: {
          ativa?: boolean
          categoria?: Database["public"]["Enums"]["categoria_congregacao"]
          cidade?: string
          created_at?: string
          estado?: string
          id?: string
          nome?: string
          qdt_obreiros?: number
          valor_mensalidade?: number
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          agendado_para: string | null
          aprovado_em: string | null
          aprovado_por: string | null
          created_at: string
          destinatario: string | null
          email_enviado: boolean
          email_erro: string | null
          enviado_em: string | null
          id: string
          lida: boolean
          mensagem: string
          meses_atraso: number
          message_id: string | null
          obreiro_id: string | null
          referencia: string
          situacao: string
          tentativas: number
          tipo: string
          titulo: string
          ultima_tentativa_em: string | null
          valor: number
        }
        Insert: {
          agendado_para?: string | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          created_at?: string
          destinatario?: string | null
          email_enviado?: boolean
          email_erro?: string | null
          enviado_em?: string | null
          id?: string
          lida?: boolean
          mensagem?: string
          meses_atraso?: number
          message_id?: string | null
          obreiro_id?: string | null
          referencia?: string
          situacao?: string
          tentativas?: number
          tipo?: string
          titulo?: string
          ultima_tentativa_em?: string | null
          valor?: number
        }
        Update: {
          agendado_para?: string | null
          aprovado_em?: string | null
          aprovado_por?: string | null
          created_at?: string
          destinatario?: string | null
          email_enviado?: boolean
          email_erro?: string | null
          enviado_em?: string | null
          id?: string
          lida?: boolean
          mensagem?: string
          meses_atraso?: number
          message_id?: string | null
          obreiro_id?: string | null
          referencia?: string
          situacao?: string
          tentativas?: number
          tipo?: string
          titulo?: string
          ultima_tentativa_em?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "notificacoes_obreiro_id_fkey"
            columns: ["obreiro_id"]
            isOneToOne: false
            referencedRelation: "obreiros"
            referencedColumns: ["id"]
          },
        ]
      }
      obreiros: {
        Row: {
          cargo: string
          congregacao_id: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          registro: string
          status_pagamento: Database["public"]["Enums"]["status_pagamento"]
          user_id: string | null
          validade: string
        }
        Insert: {
          cargo?: string
          congregacao_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          registro?: string
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          user_id?: string | null
          validade?: string
        }
        Update: {
          cargo?: string
          congregacao_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          registro?: string
          status_pagamento?: Database["public"]["Enums"]["status_pagamento"]
          user_id?: string | null
          validade?: string
        }
        Relationships: [
          {
            foreignKeyName: "obreiros_congregacao_id_fkey"
            columns: ["congregacao_id"]
            isOneToOne: false
            referencedRelation: "congregacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      pagamentos: {
        Row: {
          created_at: string
          data: string
          id: string
          obreiro_id: string
          referencia: string
          status: Database["public"]["Enums"]["status_pagamento"]
          valor: number
        }
        Insert: {
          created_at?: string
          data?: string
          id?: string
          obreiro_id: string
          referencia?: string
          status?: Database["public"]["Enums"]["status_pagamento"]
          valor?: number
        }
        Update: {
          created_at?: string
          data?: string
          id?: string
          obreiro_id?: string
          referencia?: string
          status?: Database["public"]["Enums"]["status_pagamento"]
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "pagamentos_obreiro_id_fkey"
            columns: ["obreiro_id"]
            isOneToOne: false
            referencedRelation: "obreiros"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          cpf?: string | null
          created_at?: string
          id: string
          nome?: string
        }
        Update: {
          cpf?: string | null
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      validar_credencial: {
        Args: { _registro: string }
        Returns: {
          cargo: string
          cidade: string
          congregacao: string
          estado: string
          nome: string
          registro: string
          status_pagamento: string
          valida: boolean
          validade: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "obreiro"
      categoria_congregacao: "Bronze" | "Prata" | "Ouro"
      status_pagamento: "pago" | "pendente" | "atrasado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "obreiro"],
      categoria_congregacao: ["Bronze", "Prata", "Ouro"],
      status_pagamento: ["pago", "pendente", "atrasado"],
    },
  },
} as const

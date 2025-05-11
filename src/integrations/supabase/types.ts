export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Cart: {
        Row: {
          color: string | null
          created_at: string
          id: string
          image: string | null
          product_id: string
          quantity: number | null
          size: string | null
          structure: string | null
          total_ordered: number | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          image?: string | null
          product_id: string
          quantity?: number | null
          size?: string | null
          structure?: string | null
          total_ordered?: number | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          image?: string | null
          product_id?: string
          quantity?: number | null
          size?: string | null
          structure?: string | null
          total_ordered?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      Category: {
        Row: {
          Category_id: string
          created_at: string
          image_url: string | null
          name: string | null
        }
        Insert: {
          Category_id?: string
          created_at?: string
          image_url?: string | null
          name?: string | null
        }
        Update: {
          Category_id?: string
          created_at?: string
          image_url?: string | null
          name?: string | null
        }
        Relationships: []
      }
      Clothing: {
        Row: {
          Category_id: string | null
          created_at: string
          details: Json | null
          id: number
          images: Json | null
          size: string[] | null
          "Sub-SubCategoryId": string | null
          SubCategory_id: string | null
          type: string | null
        }
        Insert: {
          Category_id?: string | null
          created_at?: string
          details?: Json | null
          id?: number
          images?: Json | null
          size?: string[] | null
          "Sub-SubCategoryId"?: string | null
          SubCategory_id?: string | null
          type?: string | null
        }
        Update: {
          Category_id?: string | null
          created_at?: string
          details?: Json | null
          id?: number
          images?: Json | null
          size?: string[] | null
          "Sub-SubCategoryId"?: string | null
          SubCategory_id?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Clothing_Category_id_fkey"
            columns: ["Category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["Category_id"]
          },
          {
            foreignKeyName: "Clothing_Sub-SubCategoryId_fkey"
            columns: ["Sub-SubCategoryId"]
            isOneToOne: false
            referencedRelation: "Sub-SubCategory"
            referencedColumns: ["Sub-SubCategory_id"]
          },
          {
            foreignKeyName: "Clothing_SubCategory_id_fkey"
            columns: ["SubCategory_id"]
            isOneToOne: false
            referencedRelation: "SubCategory"
            referencedColumns: ["SubCategory_id"]
          },
        ]
      }
      Liked_Products: {
        Row: {
          Clothing_id: number | null
          created_at: string
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          Clothing_id?: number | null
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          Clothing_id?: number | null
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Liked_Products_Clothing_id_fkey"
            columns: ["Clothing_id"]
            isOneToOne: false
            referencedRelation: "Clothing"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Liked_Products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      products: {
        Row: {
          approved: boolean | null
          Category_id: string | null
          created_at: string
          details: Json | null
          discount: Json[] | null
          image: Json[] | null
          product_id: string
          structure: string | null
          "sub-subCategory_id": string | null
          subCategory_id: string | null
          type: Database["public"]["Enums"]["Clothing_type"] | null
          uploaded_by: string | null
        }
        Insert: {
          approved?: boolean | null
          Category_id?: string | null
          created_at?: string
          details?: Json | null
          discount?: Json[] | null
          image?: Json[] | null
          product_id?: string
          structure?: string | null
          "sub-subCategory_id"?: string | null
          subCategory_id?: string | null
          type?: Database["public"]["Enums"]["Clothing_type"] | null
          uploaded_by?: string | null
        }
        Update: {
          approved?: boolean | null
          Category_id?: string | null
          created_at?: string
          details?: Json | null
          discount?: Json[] | null
          image?: Json[] | null
          product_id?: string
          structure?: string | null
          "sub-subCategory_id"?: string | null
          subCategory_id?: string | null
          type?: Database["public"]["Enums"]["Clothing_type"] | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_Category_id_fkey"
            columns: ["Category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["Category_id"]
          },
          {
            foreignKeyName: "products_sub-subCategory_id_fkey"
            columns: ["sub-subCategory_id"]
            isOneToOne: false
            referencedRelation: "Sub-SubCategory"
            referencedColumns: ["Sub-SubCategory_id"]
          },
          {
            foreignKeyName: "products_subCategory_id_fkey"
            columns: ["subCategory_id"]
            isOneToOne: false
            referencedRelation: "SubCategory"
            referencedColumns: ["SubCategory_id"]
          },
        ]
      }
      "Sub-SubCategory": {
        Row: {
          created_at: string
          image_url: string | null
          name: string | null
          "Sub-SubCategory_id": string
          SubCategory_id: string | null
        }
        Insert: {
          created_at?: string
          image_url?: string | null
          name?: string | null
          "Sub-SubCategory_id"?: string
          SubCategory_id?: string | null
        }
        Update: {
          created_at?: string
          image_url?: string | null
          name?: string | null
          "Sub-SubCategory_id"?: string
          SubCategory_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Sub-SubCategory_SubCategory_id_fkey"
            columns: ["SubCategory_id"]
            isOneToOne: false
            referencedRelation: "SubCategory"
            referencedColumns: ["SubCategory_id"]
          },
        ]
      }
      SubCategory: {
        Row: {
          Category_id: string | null
          created_at: string
          image_url: string | null
          name: string | null
          SubCategory_id: string
        }
        Insert: {
          Category_id?: string | null
          created_at?: string
          image_url?: string | null
          name?: string | null
          SubCategory_id?: string
        }
        Update: {
          Category_id?: string | null
          created_at?: string
          image_url?: string | null
          name?: string | null
          SubCategory_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SubCategory_Category_id_fkey"
            columns: ["Category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["Category_id"]
          },
        ]
      }
      user: {
        Row: {
          Approved: Database["public"]["Enums"]["User_Approval"] | null
          created_at: string
          email: string | null
          file_Url: string | null
          name: string | null
          Onboarding_step: Database["public"]["Enums"]["onboarding_step"] | null
          phone: string | null
          signin_type: Database["public"]["Enums"]["signin_type"] | null
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          Approved?: Database["public"]["Enums"]["User_Approval"] | null
          created_at?: string
          email?: string | null
          file_Url?: string | null
          name?: string | null
          Onboarding_step?:
            | Database["public"]["Enums"]["onboarding_step"]
            | null
          phone?: string | null
          signin_type?: Database["public"]["Enums"]["signin_type"] | null
          user_id: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          Approved?: Database["public"]["Enums"]["User_Approval"] | null
          created_at?: string
          email?: string | null
          file_Url?: string | null
          name?: string | null
          Onboarding_step?:
            | Database["public"]["Enums"]["onboarding_step"]
            | null
          phone?: string | null
          signin_type?: Database["public"]["Enums"]["signin_type"] | null
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      vendor_details: {
        Row: {
          Business_name: string | null
          Category: string | null
          created_at: string
          document_url: string | null
          email: string | null
          location: string | null
          name: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          Business_name?: string | null
          Category?: string | null
          created_at?: string
          document_url?: string | null
          email?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          user_id: string
        }
        Update: {
          Business_name?: string | null
          Category?: string | null
          created_at?: string
          document_url?: string | null
          email?: string | null
          location?: string | null
          name?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_details_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      return_image_color_and_image: {
        Args: { p_product_id: string }
        Returns: Json[]
      }
    }
    Enums: {
      Clothing_type: "Men" | "Women" | "Kids" | "Accessories"
      onboarding_step: "userCreation" | "Form1" | "Form2" | "Form3" | "Home"
      signin_type: "google" | "email"
      User_Approval: "Accepted" | "Waiting" | "Rejected"
      user_role: "admin" | "vendor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Clothing_type: ["Men", "Women", "Kids", "Accessories"],
      onboarding_step: ["userCreation", "Form1", "Form2", "Form3", "Home"],
      signin_type: ["google", "email"],
      User_Approval: ["Accepted", "Waiting", "Rejected"],
      user_role: ["admin", "vendor", "user"],
    },
  },
} as const

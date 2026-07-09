declare module "react-hook-form" {
  export function useForm<TFieldValues = any>(props?: any): {
    register: (name: string, options?: any) => any;
    handleSubmit: (onValid: (data: any) => void) => (e?: any) => void;
    formState: { errors: any; isSubmitting?: boolean };
    reset: () => void;
    [key: string]: any;
  };
}

declare module "@hookform/resolvers/zod" {
  export function zodResolver(schema: any): any;
}

declare module "zod" {
  export type infer<T> = any;
  export function object(schema: any): any;
  export function string(): any;
  export namespace z {
    export type infer<T> = any;
    export function object(schema: any): any;
    export function string(): any;
  }
  export const z: any;
  const zod: any;
  export default zod;
}

declare module "next-themes" {
  export function useTheme(): {
    theme?: string;
    setTheme: (theme: string) => void;
    resolvedTheme?: string;
    systemTheme?: string;
  };
}

declare module "react-hot-toast" {
  import * as React from "react";
  export const toast: {
    success: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
    [key: string]: any;
  };
  export const Toaster: React.FC<any>;
  export default toast;
}

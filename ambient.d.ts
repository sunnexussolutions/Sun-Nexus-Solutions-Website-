declare namespace JSX {
  interface Element {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module "react" {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useState<T = undefined>(): [T | undefined, (newState: T | undefined | ((prevState: T | undefined) => T | undefined)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useRef<T = undefined>(): { current: T | undefined };
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useContext<T>(context: any): T;
  export function createContext<T>(defaultValue: T): any;
  export type FC<P = {}> = (props: P & { children?: any }) => any;
  export type ReactNode = any;
  export type CSSProperties = { [key: string]: any };
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
  export function jsx(type: any, props: any, key?: string): any;
  export function jsxs(type: any, props: any, key?: string): any;
  export const Fragment: any;
}

declare module "framer-motion" {
  export const motion: {
    [key: string]: any;
  };
  export const AnimatePresence: any;
  export type HTMLMotionProps<T = any> = any;
}

declare module "lucide-react" {
  export const Search: any;
  export const Bell: any;
  export const Sun: any;
  export const Moon: any;
  export const ChevronRight: any;
  export const TrendingUp: any;
  export const X: any;
  export const LayoutGrid: any;
  export const BookOpen: any;
  export const Layers: any;
  export const FolderGit2: any;
  export const Code2: any;
  export const Users: any;
  export const User: any;
  export const Shield: any;
  export const LogOut: any;
  export const Target: any;
  export const Brain: any;
  export const MessageSquare: any;
  export const ArrowRight: any;
  export const Menu: any;
  export type IconProps = any;
  const icons: { [key: string]: any };
  export default icons;
}

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
    export function number(): any;
    export function boolean(): any;
    export function array(schema: any): any;
    export function any(): any;
  }
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
  export const toast: {
    success: (message: string, options?: any) => void;
    error: (message: string, options?: any) => void;
    [key: string]: any;
  };
  export const Toaster: (props: any) => any;
  export default toast;
}

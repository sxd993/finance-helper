export interface QuickAction {
    title: string;
    logo: React.ReactNode
    action_func: () => void;
}
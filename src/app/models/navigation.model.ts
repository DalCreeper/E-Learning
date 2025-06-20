export interface NavigationItem {
  id: string;
  title: string;
  route: string;
  children?: NavigationItem[];
}

export interface TooltipData {
  title: string;
  description: string;
  topics: string[];
  progress: number;
}

export interface IJSInspectInstance {
  lines: number[];
  code: string;
  path: string;
}

export interface IJSInspectItem {
  id: string;
  instances: IJSInspectInstance[];
}

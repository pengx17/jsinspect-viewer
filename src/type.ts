export interface IJSInspectInstance {
  lines: number[];
  code: string;
  path: string;
}

export interface IJSInspectItem {
  id: string;
  instances: IJSInspectInstance[];
}

export interface IInspectOpts {
  threshold: number;
  minInstances: number;
  path: string;
  ignore: string;
  identifiers: boolean;
  literals: boolean;
}

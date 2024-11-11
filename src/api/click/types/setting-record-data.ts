
export interface SilsonBohumConfig {
  use?: boolean;
}

export interface SettingRecordData {
  [key: string]: any;
  silsonbohum?: SilsonBohumConfig;
}

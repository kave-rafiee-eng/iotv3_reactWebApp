export type registerType = {
  add: number;
  value: number;
};

export type picMonitorType = {
  registers: registerType[];
  commFault: boolean;
};


export type StoolType = 
  | 'type1'
  | 'type2'
  | 'type3'
  | 'type4'
  | 'type5'
  | 'type6'
  | 'type7';

export interface ToiletRecord {
  id: string;
  date: string;
  time: string;
  type: StoolType;
  description: string;
  createdAt: string;
}

export interface StoolTypeOption {
  value: StoolType;
  label: string;
  description: string;
}

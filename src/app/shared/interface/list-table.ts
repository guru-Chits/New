export interface ITableColumn {
    label: string;
    field: string;
    sortable?: boolean;
    filter?: string;
    cellRenderer?: any;
  }
  
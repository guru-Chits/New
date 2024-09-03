export interface ITableColumn {
    label?: string;
    field: string;
    sortable?: boolean;
    filter?: boolean;
    cellRenderer?: any;
    onCellClicked?:any;
    cellStyle?:any;
    header?:any
    maxWidth?:any
    suppressSizeToFit?:any
}
  
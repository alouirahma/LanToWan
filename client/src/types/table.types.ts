export interface TableData {
	id: string;
	[key: string]: any;
  }
  
  export interface TableColumn<T = any> {
	key: string;
	header: string;
	accessor: (row: T) => any;
  }
  
  export interface TableProps<T = TableData> {
	data: T[];
	columns: TableColumn<T>[];
	loading?: boolean;
	error?: string;
  }
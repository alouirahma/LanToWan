import '@tanstack/react-table'; // Important: This imports the module to augment it
import { RankingInfo } from '@tanstack/match-sorter-utils'; // Only RankingInfo is needed here for the type augmentation

declare module '@tanstack/react-table' {
  interface FilterFns {
    inNumberRange: FilterFn<any>;
    fuzzy: FilterFn<unknown>; // Keep this here for type safety
  }
  interface FilterMeta {
    itemRank: RankingInfo; // Keep this here for type safety
  }
  interface ColumnMeta<TData extends object, TValue> {
    filterComponent?: React.ComponentType<{ column: Column<TData, TValue> }>;
    filterVariant?: 'text' | 'range' | 'select';
    type?: string;
  }
}
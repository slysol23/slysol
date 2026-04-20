import { BreadcrumbItem } from '@/components/breadCrum';

export interface DashboardTableColumn<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  skeletonType?: 'text' | 'image' | 'badge' | 'actions';
}

export interface DashboardTablePagination {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  previousLabel?: React.ReactNode;
  nextLabel?: React.ReactNode;
}

export interface DashboardListTableProps<T> {
  title: string;
  count?: number;
  breadcrumbs: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  topContent?: React.ReactNode;
  data: T[];
  columns: DashboardTableColumn<T>[];
  rowKey: (row: T, index: number) => React.Key;
  loading?: boolean;
  error?: string | null;
  emptyMessage: string;
  skeletonRows?: number;
  pagination?: DashboardTablePagination;
  rowClassName?: string | ((row: T, index: number) => string | undefined);
}

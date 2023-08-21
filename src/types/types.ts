export interface MetaType {
  title?: string;
  description?: string;
}

export interface MenuItemType extends MetaType {
  name: string;
  slug: string;
  path: string;
}

export interface INode {
  name: string;
  type: "row" | "column" | "widget";
  children: INode[];
  selected: boolean;
  description?: string;
  widgetId?: string;
}

export interface ILayout {
  name: string;
  code: string;
  description: string;
  type: "SECTION" | "ROUTABLE";
  status: "ACTIVE" | "INACTIVE";
}
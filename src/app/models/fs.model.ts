export interface IFileNode {
  name: string;
  type: "folder" | "applet";
  data: any;
  children: IFileNode[];
  selected: boolean;
  expanded: boolean;
}
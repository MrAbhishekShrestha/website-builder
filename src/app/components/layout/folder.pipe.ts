import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "folderChar",
  pure: true,
})
export class FolderCharPipe implements PipeTransform {
  transform(value: string): string {
    return value === "folder" ? "F" : null;
  }
}
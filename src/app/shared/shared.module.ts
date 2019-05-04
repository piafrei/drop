import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MapComponent } from "./map/map.component";

const COMPONENTS: any[] = [MapComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS]
})
export class SharedModule {}

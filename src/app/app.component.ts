// noinspection JSVoidFunctionReturnValueUsed

import {AfterViewInit, Component, effect, ElementRef, inject, model, ModelSignal, OnDestroy, Signal, viewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ColorWheel} from "./color-wheel/color-wheel";
import {Image} from "./image/image";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "primeng/tabs";
import {ToggleSwitch} from "primeng/toggleswitch";
import {AppStore} from "./store/app-store";
import {OpMode} from "./model/app.model";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    ToggleSwitch,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent
  implements AfterViewInit, OnDestroy {

  public imageEl: Signal<ElementRef> = viewChild.required<ElementRef>('im');
  public colorWheelEl: Signal<ElementRef> = viewChild.required<ElementRef>('cv');

  public store = inject(AppStore);
  private image: Image = inject(Image);
  private colorWheel: ColorWheel = inject(ColorWheel);

  public showPigmentGamut: ModelSignal<boolean> = model(false);
  public showPigmentMarks: ModelSignal<boolean> = model(false);

  constructor() {
    effect(() => {
      this.store.setShowPigmentGamut(this.showPigmentGamut());
    });
    effect(() => {
      this.store.setShowPigmentMarks(this.showPigmentMarks());
    });
  }

  public async ngAfterViewInit() {
    await this.image.init(this.imageEl().nativeElement);
    await this.colorWheel.init(this.colorWheelEl().nativeElement);
  }

  public ngOnDestroy() {
    this.image.destroy();
    this.colorWheel.destroy();
  }


  public onModeChange($event: string | number) {
    this.store.setMode($event as OpMode);
  }
}

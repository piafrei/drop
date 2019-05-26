import { Component, OnInit } from '@angular/core';
import {DropService} from '../../services/drop.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MapService} from '../../services/map.service';
import {NavController} from '@ionic/angular';
import {HomePage} from '../home/home.page';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  filters = [{ name: 'Essen & Trinken' }, { name: 'Kultur' }, { name: 'Unterhaltung & Spaß' }, { name: 'Einkaufen' }, { name: 'Nice Place' }, { name: 'Hidden Gem' }, { name: 'Überraschung' }];
  filterForm: FormGroup;
  filterFormArray;
  private matchingDrops: any[];
  private _activeFilterNumber = 0;

  constructor(private fb: FormBuilder, private dropService: DropService, private mapService: MapService, private nav: NavController) {
  }
  getActiveFilterNumber() {
        return this._activeFilterNumber;
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      activeFilter: this.fb.array([])
    });
    console.log('Active Filters' + HomePage.activeFilters);
  }

  saveFilterToFilterFormArray(filter: string, isChecked: boolean) {
    this.filterFormArray = <FormArray>this.filterForm.controls.activeFilter;
    if (isChecked) {
      this.filterFormArray.push(new FormControl(filter));
    } else {
      const index = this.filterFormArray.controls.findIndex(x => x.value === filter);
      this.filterFormArray.removeAt(index);
    }
  }

  submitSelectedFilter() {
  let rawValue;
  HomePage.activeFilters = [];

  this.matchingDrops = [];

  if (this.filterFormArray === undefined) {
    this.matchingDrops.push(this.dropService.getDrops());
  } else {
      rawValue = this.filterFormArray.getRawValue();
      for (let i = 0; i < this.filterFormArray.length; i++) {
          const element = this.filterFormArray.at(i);
          if (element.valid) {
              this.matchingDrops.push(this.dropService.getDropsByCat(element.value));
              HomePage.activeFilters.push(element.value);
          }
      }
      this._activeFilterNumber = this.filterFormArray.length;
  }
  console.log(this.matchingDrops);
  console.log(this._activeFilterNumber);

  this.mapService.clearAllMarkers();

  for (const categoryObservable of this.matchingDrops) {
      this.mapService.loadMarkers(categoryObservable);
  }
  this.nav.back();
  }
}

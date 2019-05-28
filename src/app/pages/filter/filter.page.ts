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

  filters = [{ name: 'Essen & Trinken', checked: false}, { name: 'Kultur' , checked: false}, { name: 'Unterhaltung & Spaß' , checked: false}, { name: 'Einkaufen', checked: false}, { name: 'Schöner Ort', checked: false}, { name: 'Verstecktes Juwel', checked: false}, { name: 'Überraschung', checked: false}];
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

    this.setActiveFilters();
  }

  setActiveFilters() {
      for (const activeFilter of HomePage.activeFilters) {
          for (const filterElement of this.filters) {
              if (filterElement.name === activeFilter) {
                  filterElement.checked = true;
              }
          }
      }
  }
  saveFilterToFilterFormArray(filter: string, isChecked: boolean) {
    this.filterFormArray = <FormArray>this.filterForm.controls.activeFilter;
    if (isChecked) {
      this.filterFormArray.push(new FormControl(filter));
    } else {
      const index = this.filterFormArray.controls.findIndex(x => x.value === filter);
      this.filterFormArray.removeAt(index);
      const indexActiveFilter = HomePage.activeFilters.indexOf(filter);
      if (indexActiveFilter > -1) {
          delete HomePage.activeFilters[indexActiveFilter];
      }
    }
  }

  clearActiveFilters() {
  }

  submitSelectedFilter() {
  this.clearActiveFilters();
  this.matchingDrops = [];

  let filterFormArrayLength;

  if (this.filterFormArray === undefined) {
      filterFormArrayLength = undefined;
  } else {
      filterFormArrayLength = this.filterFormArray.getRawValue().length;
  }

  if (filterFormArrayLength === undefined || filterFormArrayLength === 0 ) {
      HomePage.activeFilters = [];
      this.matchingDrops.push(this.dropService.getDrops());
  } else {
      this.addPreCheckedFilter();
      for (let i = 0; i < this.filterFormArray.length; i++) {
          const element = this.filterFormArray.at(i);
          if (element.valid) {
              this.matchingDrops.push(this.dropService.getDropsByCat(element.value));
              if (HomePage.activeFilters.indexOf(element.value) === -1) {
              HomePage.activeFilters.push(element.value);
              }
          }
      }
      this._activeFilterNumber = this.filterFormArray.length;
  }

  this.mapService.clearAllMarkers();

  for (const categoryObservable of this.matchingDrops) {
      this.mapService.loadMarkers(categoryObservable);
  }
  this.nav.back();
  }

  addPreCheckedFilter() {
     for (const preCheckedFilter of HomePage.activeFilters) {
         console.log(this.filterFormArray.getRawValue().indexOf(preCheckedFilter));
         if (this.filterFormArray.getRawValue().indexOf(preCheckedFilter) === -1) {
         this.filterFormArray.push(new FormControl(preCheckedFilter));
         }
     }
  }
}

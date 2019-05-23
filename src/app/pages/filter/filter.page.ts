import { Component, OnInit } from '@angular/core';
import {Drop, DropService} from '../../services/drop.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {HomePage} from '../home/home.page';
import {AppComponent} from '../../app.component';
import {el} from '@angular/platform-browser/testing/src/browser_util';

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

  constructor(private fb: FormBuilder, public homePage: HomePage, private dropService: DropService) {
  }

  ngOnInit() {
    this.filterForm = this.fb.group({
      activeFilter: this.fb.array([])
    });
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
  const rawValue = this.filterFormArray.getRawValue();
      console.log('Active Filter to submit ' + rawValue);

  this.matchingDrops = [];
  for (let i = 0; i < this.filterFormArray.length; i++) {
      const element = this.filterFormArray.at(i);
      if (element.valid) {
        this.matchingDrops.push(this.dropService.getDropsByCat(element.value));
      }
   }
  console.log(this.matchingDrops);
  }
}

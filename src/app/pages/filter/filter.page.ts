import { Component, OnInit } from '@angular/core';
import {Drop} from '../../services/drop.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  filters = [{ name: 'EssenTrinken' }, { name: 'KulturSehenswuerdigkeiten' }, { name: 'Einkaufen' }, { name: 'NicePlace' }, { name: 'HiddenGem' }, { name: 'Ueberraschung' }];
  filterForm: FormGroup;
  filterFormArray;

  constructor(private fb: FormBuilder) {
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
  console.log('Active Filter to submit ' + this.filterFormArray.getRawValue());
  }
}

import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { isArray } from 'util';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Constants } from 'src/app/constants';
import { CustomValidatorsService } from 'src/app/service/custom-validators.service';
import { FormService, formConstants } from 'src/app/service/form.service';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { DataEntryService } from '@src/app/data-entry/services/data-entry.service';

declare var $;
@Component({
  selector: 'app-covid19-tracker-entry',
  templateUrl: './covid19-tracker-entry.component.html',
  styleUrls: ['./covid19-tracker-entry.component.scss', '../../dashboard-view.component.scss']
})
export class Covid19TrackerEntryComponent implements OnInit, OnChanges {

  @Input() mainFormGroup: FormGroup;
  @Input() mainFormConfig: any[];
  @Input() currentTrackingData;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  timeOut;
  trackingDate: Date = new Date();
  minDate: Date = new Date('13 april 2020');
  maxDate: Date = new Date();
  displayRefreshYesterDay = true;
  isErrorOccured = false;
  previousTrackedDate = new Date();

  constructor(
    private dataEnrtyService: DataEntryService,
    private formService: FormService,
  ) { }

  ngOnInit() {
    this.getTrakingDataByDate(this.trackingDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentTrackingData) {
    }
  }

  getTrakingDataByDate(date) {
    this.dataEnrtyService.getTrakingDataByDate(date).subscribe((res) => {
      if (!(res && isArray(res.data))) {
        return null;
      }
      else {
        this.previousTrackedDate = this.trackingDate;
        this.isErrorOccured = false;
        this.currentTrackingData = [res.data[0], res.data[1], ...res.data.filter((e, i) => i > 1).sort((a, b) => a.totalConfirmedCases < b.totalConfirmedCases ? 1 : -1)];
        this.createFormConfig(this.currentTrackingData);
      }
    }, (error) => {
      $('#error').modal('show');
      this.isErrorOccured = true;
      this.trackingDate = this.previousTrackedDate;
      this.handelYesterDayData();
    })
  }

  createFormConfig(data) {
    let config = [
      {
        controlType: formConstants.formGroup,
        columnName: "group",
        validators: [Validators.required],
        formInputs: [
          {
            controlType: formConstants.formArray,
            columnName: "areaWiseIndicators",
            validators: [Validators.required],
            formInputs: []
          }
        ]
      }
    ]
    data.map((eachArea, areaIndex) => {
      let eachAreaConfig = {
        controlType: formConstants.formGroup,
        columnName: areaIndex,
        validators: [Validators.required],
        index: areaIndex,
        extraData: eachArea,
        formInputs: [
          {
            controlType: "text",
            type: "hidden",
            columnName: "areaCode",
            value: eachArea.areaCode,
            validators: [Validators.required]
          },
          {
            controlType: "text",
            type: "text",
            columnName: "areaName",
            value: eachArea.areaName,
            validators: [Validators.required]
          },
          {
            controlType: "text",
            type: "hidden",
            columnName: "sbmAreaId",
            value: eachArea.sbmAreaId,
            validators: [Validators.required]
          },
          {
            controlType: "text",
            type: "hidden",
            columnName: "activeCasesTrend",
            value: eachArea.activeCasesTrend,
            validators: [Validators.required]
          },
          {
            controlType: "text",
            type: "hidden",
            columnName: "recoveredCasesTrend",
            value: eachArea.recoveredCasesTrend,
            validators: [Validators.required]
          },
          {
            controlType: "text",
            type: "hidden",
            columnName: "deceasedCasesTrend",
            value: eachArea.deceasedCasesTrend,
            validators: [Validators.required]
          },
          {
            controlType: "text",
            type: "number",
            columnName: "confirmedCasesDiff",
            value: parseInt(eachArea.confirmedCasesDiff) || 0,
            required: false,
            disabled: eachArea.areaCode === 'IND021',
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "activeCasesDiff",
            value: parseInt(eachArea.activeCasesDiff) || 0,
            required: false,
            disabled: eachArea.areaCode === 'IND021',
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "recoveredCasesDiff",
            value: parseInt(eachArea.recoveredCasesDiff) || 0,
            required: false,
            disabled: eachArea.areaCode === 'IND021',
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "deceasedCasesDiff",
            value: parseInt(eachArea.deceasedCasesDiff) || 0,
            required: false,
            disabled: eachArea.areaCode === 'IND021',
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "confirmedCases",
            value: parseInt(eachArea.confirmedCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "activeCases",
            value: parseInt(eachArea.activeCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "recoveredCases",
            value: parseInt(eachArea.recoveredCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "deceasedCases",
            value: parseInt(eachArea.deceasedCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "totalConfirmedCases",
            value: parseInt(eachArea.totalConfirmedCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "totalActiveCases",
            value: parseInt(eachArea.totalActiveCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "totalRecoveredCases",
            value: parseInt(eachArea.totalRecoveredCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "text",
            type: "number",
            columnName: "totalDeceasedCases",
            value: parseInt(eachArea.totalDeceasedCases) || 0,
            required: false,
            validators: [Validators.required, CustomValidatorsService.validatePositiveNumber],
          },
          {
            controlType: "hidden",
            type: "number",
            columnName: "isValueUpdated",
            value: false,
            required: false,
            validators: [Validators.required],
          },
        ]
      };
      config[0].formInputs[0].formInputs.push(eachAreaConfig);
    })

    // console.log("fc", config);
    this.mainFormConfig = config;
    // console.log("fc-va", this.mainFormConfig);
    this.mainFormGroup = <FormGroup>this.formService.createReactiveForm(config).controls['group'];
    // console.log("fg", this.mainFormGroup);
  }


  projectValue(indicatorIndex, areaIndex, eachAreaItem) {
    this.timeOut ? clearTimeout(this.timeOut) : '';
    this.timeOut = setTimeout(() => {
      let eachAreaValue = this.mainFormGroup.get('areaWiseIndicators').get(areaIndex.toString()).value;
      let activeCasesDiff = parseInt(eachAreaValue.confirmedCasesDiff || 0) - parseInt(eachAreaValue.recoveredCasesDiff || 0) - parseInt(eachAreaValue.deceasedCasesDiff || 0);
      eachAreaValue.activeCasesDiff = activeCasesDiff;
      let valueToBeUpdate = {
        isValueUpdated: true,
        activeCasesDiff: activeCasesDiff,
        totalConfirmedCases: (eachAreaValue.confirmedCases || 0) + (eachAreaValue.confirmedCasesDiff || 0),
        totalActiveCases: (eachAreaValue.activeCases || 0) + (eachAreaValue.activeCasesDiff || 0),
        totalRecoveredCases: (eachAreaValue.recoveredCases || 0) + (eachAreaValue.recoveredCasesDiff || 0),
        totalDeceasedCases: (eachAreaValue.deceasedCases || 0) + (eachAreaValue.deceasedCasesDiff || 0)
      }
      this.mainFormGroup.get("areaWiseIndicators").get(areaIndex + '').patchValue(valueToBeUpdate);
      this.updateOdishaValue();
      clearTimeout(this.timeOut);
    }, 300)
  }

  updateOdishaValue() {
    let data = this.mainFormGroup.get("areaWiseIndicators").value;
    let odishaData = {};
    data.forEach((element, index) => {
      if (index < 2) {
        return 0;
      }
      // odishaData["confirmedCases"] = odishaData["confirmedCases"] || 0 + element["confirmedCases"] || 0;
      odishaData["confirmedCasesDiff"] = parseInt(odishaData["confirmedCasesDiff"] || 0) + parseInt(element["confirmedCasesDiff"] || 0);
      odishaData["totalConfirmedCases"] = parseInt(odishaData["totalConfirmedCases"] || 0) + parseInt(element["totalConfirmedCases"] || 0);

      // odishaData["activeCases"] = odishaData["activeCases"] || 0 + element["activeCases"] || 0;
      odishaData["activeCasesDiff"] = parseInt(odishaData["activeCasesDiff"] || 0) + parseInt(element["activeCasesDiff"] || 0);
      odishaData["totalActiveCases"] = parseInt(odishaData["totalActiveCases"] || 0) + parseInt(element["totalActiveCases"] || 0);
      // odishaData["activeCasesTrend"] = odishaData["activeCasesTrend"] || 0 + element["activeCasesTrend"]

      // odishaData["recoveredCases"] = odishaData["recoveredCases"] || 0 + element["recoveredCases"] || 0;
      odishaData["recoveredCasesDiff"] = parseInt(odishaData["recoveredCasesDiff"] || 0) + parseInt(element["recoveredCasesDiff"] || 0);
      odishaData["totalRecoveredCases"] = parseInt(odishaData["totalRecoveredCases"] || 0) + parseInt(element["totalRecoveredCases"] || 0);
      // odishaData["recoveredCasesTrend"] = odishaData["recoveredCasesTrend"] || 0 + element["recoveredCasesTrend"]

      // odishaData["deceasedCases"] = odishaData["deceasedCases"] || 0 + element["deceasedCases"] || 0;
      odishaData["deceasedCasesDiff"] = parseInt(odishaData["deceasedCasesDiff"] || 0) + parseInt(element["deceasedCasesDiff"] || 0);
      odishaData["totalDeceasedCases"] = parseInt(odishaData["totalDeceasedCases"] || 0) + parseInt(element["totalDeceasedCases"] || 0);
      // odishaData["deceasedCasesTrend"] = odishaData["deceasedCasesTrend"] || 0 + element["deceasedCasesTrend"]

    });
    this.mainFormGroup.get("areaWiseIndicators").get("1").patchValue(odishaData);
  }

  precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  dateChanged(selectedValue) {
    this.getTrakingDataByDate(this.trackingDate);
    this.handelYesterDayData();
  }

  handelYesterDayData(){
    let selectedDate = new Date(this.trackingDate.toDateString());
    selectedDate.setDate(selectedDate.getDate() -1);
    this.displayRefreshYesterDay = selectedDate.getTime() >= this.minDate.getTime();
  }

  getValueByProperty(eachAreaWise, areaIndex, property, offsetProperty?) {
    if (eachAreaWise.extraData.areaCode === 'IND021') {
      let data = this.mainFormGroup.get('areaWiseIndicators').value;
      return data.reduce((final, item, index) => {
        if (index < 2) {
          return final
        }
        final = final + (item[property] || 0) + (offsetProperty ? item[offsetProperty] || 0 : 0)
        return final;
      }, 0);
    }
    let eachAreaValue = this.mainFormGroup.get('areaWiseIndicators').get(areaIndex.toString()).value;
    let actualData = property && eachAreaValue && eachAreaValue[property] || 0;
    let offsetData = offsetProperty && eachAreaValue ? eachAreaValue[offsetProperty] || 0 : 0;
    return actualData + offsetData;
  }

  refreshYesterDay($event) {
    this.dataEnrtyService.refreshYesterDayData(this.trackingDate).subscribe(res => {
      if (!(res && isArray(res.data))) {
        return null;
      }
      else {
        this.currentTrackingData = [res.data[0], res.data[1], ...res.data.filter((e, i) => i > 1).sort((a, b) => a.totalConfirmedCases < b.totalConfirmedCases ? 1 : -1)];
        this.createFormConfig(this.currentTrackingData);
      }
    }, (error) => {
      $('#error').modal('show');
    })
  }

  submit(event) {
    event.preventDefault();
    event.stopPropagation()
    let data = this.mainFormGroup.get('areaWiseIndicators').value;
    let finalData = data.filter(item => item.isValueUpdated);
    this.dataEnrtyService.saveTrackingData(finalData, this.trackingDate).subscribe(res => {
      $('#publishedSuccess').modal('show');
      this.getTrakingDataByDate(this.trackingDate);
    }, (error) => {
      $('#error').modal('show');
    });
  }

  reset(event) {
    event.preventDefault();
    this.createFormConfig(this.currentTrackingData);
  }
}

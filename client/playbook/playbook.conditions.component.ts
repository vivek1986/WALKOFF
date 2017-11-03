import { Component, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';

import { PlaybookService } from './playbook.service';

import { AppApi } from '../models/api/appApi';
import { ConditionApi } from '../models/api/conditionApi';
import { TransformApi } from '../models/api/transformApi';
import { ParameterApi } from '../models/api/parameterApi';
import { Workflow } from '../models/playbook/workflow';
import { Argument } from '../models/playbook/argument';
import { Condition } from '../models/playbook/condition';
import { Transform } from '../models/playbook/transform';

@Component({
	selector: 'playbook-conditions-component',
	templateUrl: 'client/playbook/playbook.conditions.html',
	styleUrls: [],
	encapsulation: ViewEncapsulation.None,
	providers: [PlaybookService]
})
export class PlaybookConditionsComponent {
	@Input() selectedAppName: string;
	@Input() conditions: Condition[];
	@Input() appApis: AppApi[];
	@Input() loadedWorkflow: Workflow;

	selectedConditionApi: string;
	appNamesWithConditions: string[];

	constructor() { }

	ngOnInit() {
		this.resetConditionSelection(this.selectedAppName);
		this.appNamesWithConditions = this.appApis.filter(app => app.condition_apis && app.condition_apis.length).map(app => app.name);
	}

	resetConditionSelection(appName: string) {
		let app = this.appApis.find(a => a.name === appName);

		if (app.condition_apis && app.condition_apis.length) this.selectedConditionApi = app.condition_apis[0].name;
	}

	addCondition(): void {
		let api = this.appApis.find(a => a.name === this.selectedAppName).condition_apis.find(c => c.name === this.selectedConditionApi);

		let args: Argument[] = [];
		// Omit the parameter that matches the dataIn
		api.parameters.filter(p => p.name !== api.dataIn).forEach((parameterApi) => {
			args.push({
				name: parameterApi.name,
				value: parameterApi.schema.default != null ? parameterApi.schema.default : null,
				reference: "",
				selector: ""
			});
		});

		this.conditions.push({
			uid: null,
			app: this.selectedAppName,
			action: this.selectedConditionApi,
			args: args,
			transforms: []
		});
	}

	moveUp(index: number): void {
		let idAbove = index - 1;
		let toBeSwapped = this.conditions[idAbove];

		this.conditions[idAbove] = this.conditions[index];
		this.conditions[index] = toBeSwapped;
	}

	moveDown(index: number): void {
		let idBelow = index + 1;
		let toBeSwapped = this.conditions[idBelow];

		this.conditions[idBelow] = this.conditions[index];
		this.conditions[index] = toBeSwapped;
	}

	removeCondition(index: number): void {
		this.conditions.splice(index, 1);
	}

	getConditionApiArgs(appName: string, conditionName: string, argumentName: string): ParameterApi {
		return this.appApis.find(a => a.name === appName).condition_apis.find(c => c.name === conditionName).parameters.find(a => a.name === argumentName);
	}
	getConditionNamesForApp(): string[] {
		return this.appApis.find(a => a.name === this.selectedAppName).condition_apis.map(c => c.name);
	}
}
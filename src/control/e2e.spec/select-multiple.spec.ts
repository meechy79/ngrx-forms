import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';

import { Component, Input } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Action, ActionsSubject } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { SetValueAction, MarkAsDirtyAction } from '../../actions';
import { NgrxFormsModule } from '../../module';
import { createFormControlState, FormControlState } from '../../state';
import { NgrxValueConverters } from '../../control/value-converter';

const SELECT_OPTIONS = ['op1', 'op2'];

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-multiple-test',
  template: `
  <select multiple [ngrxFormControlState]="state" [ngrxValueConverter]="valueConverter">
    <option *ngFor="let o of options" [value]="o">{{o}}</option>
  </select>
  `,
})
export class SelectMultipleComponent {
  @Input() state: FormControlState<string>;
  options = SELECT_OPTIONS;
  valueConverter = NgrxValueConverters.objectToJSON;
}

describe(SelectMultipleComponent.name, () => {
  let component: SelectMultipleComponent;
  let fixture: ComponentFixture<SelectMultipleComponent>;
  let actionsSubject: ActionsSubject;
  let actions$: Observable<Action>;
  let element: HTMLSelectElement;
  let option1: HTMLOptionElement;
  let option2: HTMLOptionElement;
  const FORM_CONTROL_ID = 'test ID';
  const INITIAL_FORM_CONTROL_VALUE = `["${SELECT_OPTIONS[1]}"]`;
  const INITIAL_STATE = createFormControlState(FORM_CONTROL_ID, INITIAL_FORM_CONTROL_VALUE);

  beforeEach(() => {
    actionsSubject = new Subject<Action>() as ActionsSubject;
    actions$ = actionsSubject as Observable<Action>; // cast required due to mismatch of lift() function signature
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgrxFormsModule],
      declarations: [SelectMultipleComponent],
      providers: [{ provide: ActionsSubject, useValue: actionsSubject }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMultipleComponent);
    component = fixture.componentInstance;
    component.state = INITIAL_STATE;
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    element = nativeElement.querySelector('select') as HTMLSelectElement;
    option1 = nativeElement.querySelectorAll('option')[0] as HTMLOptionElement;
    option2 = nativeElement.querySelectorAll('option')[1] as HTMLOptionElement;
  });

  it('should select the correct option initially', () => {
    expect(option2.selected).toBe(true);
  });

  it('should trigger a SetValueAction with the selected value when an option is selected', done => {
    actions$.first().subscribe(a => {
      expect(a.type).toBe(SetValueAction.TYPE);
      expect((a as SetValueAction<string>).payload.value).toBe(JSON.stringify(SELECT_OPTIONS));
      done();
    });

    option1.selected = true;
    element.dispatchEvent(new Event('change'));
  });

  it(`should trigger a ${MarkAsDirtyAction.name} when an option is selected`, done => {
    actions$.skip(1).first().subscribe(a => {
      expect(a.type).toBe(MarkAsDirtyAction.TYPE);
      done();
    });

    option1.selected = true;
    element.dispatchEvent(new Event('change'));
  });
});

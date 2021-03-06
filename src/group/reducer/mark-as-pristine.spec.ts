import { MarkAsPristineAction } from '../../actions';
import { cast } from '../../state';
import { markAsPristineReducer } from './mark-as-pristine';
import {
  FORM_CONTROL_ID,
  FORM_CONTROL_INNER2_ID,
  FORM_CONTROL_INNER3_ID,
  FORM_CONTROL_INNER5_ID,
  FORM_CONTROL_INNER_ID,
  INITIAL_STATE,
  INITIAL_STATE_FULL,
  setPropertiesRecursively,
} from './test-util';

describe(`form group ${markAsPristineReducer.name}`, () => {
  it('should update state if dirty', () => {
    const state = { ...INITIAL_STATE, isDirty: true, isPristine: false };
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not update state if pristine', () => {
    const resultState = markAsPristineReducer(INITIAL_STATE, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState).toBe(INITIAL_STATE);
  });

  it('should mark control children as pristine', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner.isDirty).toEqual(false);
    expect(resultState.controls.inner.isPristine).toEqual(true);
  });

  it('should mark group children as pristine', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner3.isDirty).toEqual(false);
    expect(resultState.controls.inner3.isPristine).toEqual(true);
  });

  it('should mark array children as pristine', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_ID));
    expect(resultState.controls.inner5.isDirty).toEqual(false);
    expect(resultState.controls.inner5.isPristine).toEqual(true);
  });

  it('should mark state as pristine if all children are pristine when control child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_FULL,
      [['isDirty', true], ['isPristine', false]],
      FORM_CONTROL_INNER2_ID,
      FORM_CONTROL_INNER3_ID,
      FORM_CONTROL_INNER5_ID,
    ));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should not mark state as pristine if not all children are pristine when control child is updated', () => {
    const state = cast(setPropertiesRecursively(INITIAL_STATE_FULL, [['isDirty', true], ['isPristine', false]]));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER_ID));
    expect(resultState.isDirty).toEqual(true);
    expect(resultState.isPristine).toEqual(false);
  });

  it('should mark state as pristine if all children are pristine when group child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_FULL,
      [['isDirty', true], ['isPristine', false]],
      FORM_CONTROL_INNER_ID,
      FORM_CONTROL_INNER2_ID,
      FORM_CONTROL_INNER5_ID,
    ));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER3_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });

  it('should mark state as pristine if all children are pristine when array child is updated', () => {
    const state = cast(setPropertiesRecursively(
      INITIAL_STATE_FULL,
      [['isDirty', true], ['isPristine', false]],
      FORM_CONTROL_INNER_ID,
      FORM_CONTROL_INNER2_ID,
      FORM_CONTROL_INNER3_ID,
    ));
    const resultState = markAsPristineReducer(state, new MarkAsPristineAction(FORM_CONTROL_INNER5_ID));
    expect(resultState.isDirty).toEqual(false);
    expect(resultState.isPristine).toEqual(true);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPatientInfoComponent } from './edit-patient-info.component';

describe('EditPatientInfoComponent', () => {
  let component: EditPatientInfoComponent;
  let fixture: ComponentFixture<EditPatientInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPatientInfoComponent]
    });
    fixture = TestBed.createComponent(EditPatientInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDiseasesComponent } from './edit-diseases.component';

describe('EditDiseasesComponent', () => {
  let component: EditDiseasesComponent;
  let fixture: ComponentFixture<EditDiseasesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDiseasesComponent]
    });
    fixture = TestBed.createComponent(EditDiseasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEyeCampComponent } from './edit-eye-camp.component';

describe('EditEyeCampComponent', () => {
  let component: EditEyeCampComponent;
  let fixture: ComponentFixture<EditEyeCampComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEyeCampComponent]
    });
    fixture = TestBed.createComponent(EditEyeCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

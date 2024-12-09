import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHbCampComponent } from './edit-hb-camp.component';

describe('EditHbCampComponent', () => {
  let component: EditHbCampComponent;
  let fixture: ComponentFixture<EditHbCampComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHbCampComponent]
    });
    fixture = TestBed.createComponent(EditHbCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdCampComponent } from './edit-ad-camp.component';

describe('EditAdCampComponent', () => {
  let component: EditAdCampComponent;
  let fixture: ComponentFixture<EditAdCampComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAdCampComponent]
    });
    fixture = TestBed.createComponent(EditAdCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

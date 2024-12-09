import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMegaCampComponent } from './edit-mega-camp.component';

describe('EditMegaCampComponent', () => {
  let component: EditMegaCampComponent;
  let fixture: ComponentFixture<EditMegaCampComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditMegaCampComponent]
    });
    fixture = TestBed.createComponent(EditMegaCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVillagesComponent } from './edit-villages.component';

describe('EditVillagesComponent', () => {
  let component: EditVillagesComponent;
  let fixture: ComponentFixture<EditVillagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditVillagesComponent]
    });
    fixture = TestBed.createComponent(EditVillagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

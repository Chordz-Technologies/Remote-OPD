import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddusersbyAdminComponent } from './addusersby-admin.component';

describe('AddusersbyAdminComponent', () => {
  let component: AddusersbyAdminComponent;
  let fixture: ComponentFixture<AddusersbyAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddusersbyAdminComponent]
    });
    fixture = TestBed.createComponent(AddusersbyAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

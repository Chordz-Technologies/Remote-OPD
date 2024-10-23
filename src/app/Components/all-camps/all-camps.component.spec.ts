import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCampsComponent } from './all-camps.component';

describe('AllCampsComponent', () => {
  let component: AllCampsComponent;
  let fixture: ComponentFixture<AllCampsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllCampsComponent]
    });
    fixture = TestBed.createComponent(AllCampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

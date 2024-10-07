import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampsComponent } from './camps.component';

describe('CampsComponent', () => {
  let component: CampsComponent;
  let fixture: ComponentFixture<CampsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampsComponent]
    });
    fixture = TestBed.createComponent(CampsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

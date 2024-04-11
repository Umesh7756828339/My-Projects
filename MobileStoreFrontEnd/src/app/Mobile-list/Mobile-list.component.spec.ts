import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileListComponent } from './Mobile-list.component';

describe('GroceryListComponent', () => {
  let component: MobileListComponent;
  let fixture: ComponentFixture<MobileListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileListComponent]
    });
    fixture = TestBed.createComponent(MobileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

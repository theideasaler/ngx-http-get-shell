import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxHttpGetShellComponent } from './ngx-http-get-shell.component';

describe('NgxHttpGetShellComponent', () => {
  let component: NgxHttpGetShellComponent;
  let fixture: ComponentFixture<NgxHttpGetShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxHttpGetShellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxHttpGetShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

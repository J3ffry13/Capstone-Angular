import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilWebRegistroComponent } from './perfil-web-registro.component';

describe('PerfilWebRegistroComponent', () => {
  let component: PerfilWebRegistroComponent;
  let fixture: ComponentFixture<PerfilWebRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilWebRegistroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilWebRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

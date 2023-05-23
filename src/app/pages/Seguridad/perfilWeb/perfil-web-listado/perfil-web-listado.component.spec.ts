import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilWebListadoComponent } from './perfil-web-listado.component';

describe('PerfilWebListadoComponent', () => {
  let component: PerfilWebListadoComponent;
  let fixture: ComponentFixture<PerfilWebListadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilWebListadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilWebListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

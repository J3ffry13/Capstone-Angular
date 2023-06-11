import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActividadesService } from '@services/configuracion/actividades.service';
import { LoginService } from '@services/login.service';
import { SnackbarComponent } from '@components/crud/snackbar/snackbar.component';
import { ActividadesRegistroComponent } from './actividades-registro.component';
import { ActividadModel } from '@/Models/configuracion/ActividadModel.model';

describe('ActividadesRegistroComponent', () => {
  let component: ActividadesRegistroComponent;
  let fixture: ComponentFixture<ActividadesRegistroComponent>;
  let mockMatDialogRef: Partial<MatDialogRef<ActividadesRegistroComponent>>;
  let mockActividadesService: Partial<ActividadesService>;
  let mockLoginService: Partial<LoginService>;
  let mockFormBuilder: Partial<FormBuilder>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;


  beforeEach(async () => {

    mockMatDialogRef = {
      close: jasmine.createSpy('close'),
    };

    mockActividadesService = {
      crea_edita_Actividades$: jasmine.createSpy('crea_edita_Actividades$').and.returnValue(of({})),
    };

    mockLoginService = {
      getTokenDecoded: jasmine.createSpy('getTokenDecoded').and.returnValue({ usuarioNombre: 'testUser' }),
    };

    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    mockFormBuilder = {
      group: jasmine.createSpy('group').and.callThrough(),
      control: jasmine.createSpy('control').and.callThrough(),
    };

    await TestBed.configureTestingModule({
      declarations: [ActividadesRegistroComponent, SnackbarComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatInputModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockMatDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { registro: new ActividadModel() } },
        { provide: ActividadesService, useValue: mockActividadesService },
        { provide: LoginService, useValue: mockLoginService },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: FormBuilder, useValue: new FormBuilder() }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadesRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Debe inicializar el componente', () => {
    
    component.registro = undefined;
    expect(component.loading).toBe(false);
    expect(component.registro).toBeUndefined();
    expect(component.registroForm).toBeDefined();
    expect(component.user).toBeDefined();
  });

  it('should create the form with default values', () => {
    const mockFormValue = {
      codigo: '',
      nombre: '',
      estado: false
    };
    component.registro = new ActividadModel()
    component.createForm()
    // expect(mockFormBuilder.group).toHaveBeenCalledWith(mockFormValue);
    expect(component.loading).toBe(false);
    expect(component.registroForm).toBeDefined();
  });

  it('should return the title based on registro.idActividad', () => {
    component.registro = new ActividadModel();
    expect(component.getTitle()).toBe('Nueva Actividad');

    component.registro.idActividad = 0;
    expect(component.getTitle()).toBe('Nueva Actividad');

    component.registro.idActividad = 1;
    component.registro.nombre = 'Test Activity';
    expect(component.getTitle()).toBe('Editar Actividad: Test Activity1');
  });

  // it('should call crea_edita_Actividades$ method', () => {
  //   const mockFormValue = {
  //     codigo: '123',
  //     nombre: 'Test Activity',
  //     estado: true
  //   };
  //   const mockRawValue = {
  //     ...mockFormValue,
  //     idActividad: 1,
  //     accion: 2,
  //     login: 'testUser'
  //   };
  
  //   spyOn(component.registroForm, 'getRawValue').and.returnValue(mockRawValue);
  //   component.registro.idActividad = 1;
  //   component.guardarRegistro();
  
  //   expect(mockActividadesService.crea_edita_Actividades$).toHaveBeenCalledWith({ registroDatos: mockRawValue });
  //   expect(mockSnackBar.openFromComponent).toHaveBeenCalled(); // Comprueba que se haya llamado a openFromComponent()
  //   expect(mockMatDialogRef.close).toHaveBeenCalledWith({ result: true, close: false });
  // });
 

  it('should close the dialog', () => {
    component.onNoClick();
    expect(mockMatDialogRef.close).toHaveBeenCalled();
  });

//   it('should return the error message for a control', () => {
//     const mockControlName = 'codigo';
//     const mockControl = new FormControl('', { required: true });
//     spyOn(component.registroForm, 'get').and.returnValue(mockControl);

//     expect(component.getError(mockControlName)).toBe('El CÓDIGO es requerida');
//     expect(component.registroForm.get).toHaveBeenCalledWith(mockControlName);
//   });

  // Add more test cases as needed
});

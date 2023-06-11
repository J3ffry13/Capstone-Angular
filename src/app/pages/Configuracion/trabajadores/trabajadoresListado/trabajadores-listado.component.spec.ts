import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule, FormGroup, FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ExcelService} from '@services/excel.service';
import {TrabajadoresService} from '@services/configuracion/trabajadores.service';
import {LoginService} from '@services/login.service';
import {ConfirmActionComponent} from '@components/crud/confirm-action/confirm-action.component';
import {TrabajadoresListadoComponent} from './trabajadores-listado.component';
import {of} from 'rxjs';
import {PersonaModel} from '@/Models/configuracion/PersonaModel.model';
import {UtilsService} from '@services/utils/utils.service';

describe('TrabajadoresListadoComponent', () => {
    let component: TrabajadoresListadoComponent;
    let fixture: ComponentFixture<TrabajadoresListadoComponent>;
    let trabajadoresService: TrabajadoresService;
    let utilsService: UtilsService;
    let excelService: ExcelService;
    let loginService: LoginService;
    let matDialog: MatDialog;
    let matSnackBar: MatSnackBar;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [TrabajadoresListadoComponent],
            providers: [
                {
                    provide: TrabajadoresService,
                    useValue: jasmine.createSpyObj('TrabajadoresService', [
                        'listarRegistros$',
                        'elimina_Trabajadores$'
                    ])
                },
                {
                    provide: UtilsService,
                    useValue: jasmine.createSpyObj('UtilsService', [
                        'listadoCombos$'
                    ])
                },
                {
                    provide: ExcelService,
                    useValue: jasmine.createSpyObj('ExcelService', [
                        'exportToExcelGenerico'
                    ])
                },
                {
                    provide: LoginService,
                    useValue: jasmine.createSpyObj('LoginService', [
                        'getTokenDecoded'
                    ])
                },
                {
                    provide: MatDialog,
                    useValue: jasmine.createSpyObj('MatDialog', ['open'])
                },
                {
                    provide: MatSnackBar,
                    useValue: jasmine.createSpyObj('MatSnackBar', [
                        'openFromComponent'
                    ])
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TrabajadoresListadoComponent);
        component = fixture.componentInstance;
        trabajadoresService = TestBed.inject(TrabajadoresService);
        excelService = TestBed.inject(ExcelService);
        loginService = TestBed.inject(LoginService);
        matDialog = TestBed.inject(MatDialog);
        matSnackBar = TestBed.inject(MatSnackBar);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should createFrom', () => {
        component.createFrom();

        expect(component.formGroupFiltros).toBeTruthy();
        expect(component.formGroupFiltros.get('dni')).toBeTruthy();
    });

    it('should refreshLista', () => {
        const mockListadoResult = ['item1', 'item2'];

        component.listadoResult = mockListadoResult;
        component.paginator = jasmine.createSpyObj('MatPaginator', [
            'nextPage'
        ]);
        component.sort = jasmine.createSpyObj('MatSort', ['sort']);

        component.refreshLista();

        expect(component.dataSource).toBeTruthy();
        expect(component.dataSource.data).toEqual(mockListadoResult);
        expect(component.dataSource.paginator).toEqual(component.paginator);
        expect(component.dataSource.sort).toEqual(component.sort);
        expect(component.loadingData).toBeFalse();
        // expect(component.ref.markForCheck).toHaveBeenCalled();
    });


    it('should navigate to workers-reg with new registro', () => {
        const mockRegistro = new PersonaModel();
        mockRegistro.clean();
        const mockState = {
            param: mockRegistro,
            listTipoContcbo: ['cont1', 'cont2'],
            listTipoDoccbo: ['doc1', 'doc2']
        };
        const navigateSpy = spyOn(component.router, 'navigate');

        component.listTipoContcbo = ['cont1', 'cont2'];
        component.listTipoDoccbo = ['doc1', 'doc2'];

        component.nuevo();

        expect(navigateSpy).toHaveBeenCalledWith(['masters/workers-reg'], {
            state: mockState
        });
    });

    it('should navigate to workers-reg with existing registro', () => {
        const mockRegistro = new PersonaModel();
        const mockState = {
            param: mockRegistro,
            listTipoContcbo: ['cont1', 'cont2'],
            listTipoDoccbo: ['doc1', 'doc2']
        };
        const navigateSpy = spyOn(component.router, 'navigate');

        component.listTipoContcbo = ['cont1', 'cont2'];
        component.listTipoDoccbo = ['doc1', 'doc2'];

        component.edit(mockRegistro);

        expect(navigateSpy).toHaveBeenCalledWith(['masters/workers-reg'], {
            state: mockState
        });
    });

    // it('should apply filter', () => {
    //   const mockValue = 'filterValue';
    //   const filterSpy = spyOn(component.dataSource, 'filter');

    //   component.applyFilterGlobal(mockValue);

    //   expect(filterSpy).toHaveBeenCalledWith(mockValue);
    // });

    it('should render columns', () => {
        const mockCustomColumns = [
            {
                name: 'nro',
                label: 'NRO',
                esFlag: false,
                width: 'mat-column mat-column-60 center-cell'
            },
            {
                name: 'tipoDocumento',
                label: 'T. DOCUMENTO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'dni',
                label: 'DOCUMENTO',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'nombres',
                label: 'NOMBRES',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'apellidos',
                label: 'APELLIDOS',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            },
            {
                name: 'f_nacimiento',
                label: 'F. NACIMIENTO',
                esFlag: false,
                width: 'mat-column'
            },
            {
                name: 'estadoTrab',
                label: 'ESTADO',
                esFlag: true,
                width: 'mat-column mat-column-100 center-cell'
            },
            {
                name: 'actions',
                label: '...',
                esFlag: false,
                width: 'mat-column mat-column-120 center-cell'
            }
        ];

        component.renderColumns();

        expect(component.customColumns).toEqual(mockCustomColumns);
        expect(component.displayedColumns).toEqual(
            mockCustomColumns.map((column) => column.name)
        );
    });

    it('should get item by html', () => {
        const mockNum1 = 1;
        const mockNum2 = 2;
        const mockNum3 = 3;

        const result1 = component.getItemByHtml(mockNum1);
        const result2 = component.getItemByHtml(mockNum2);
        const result3 = component.getItemByHtml(mockNum3);

        expect(result1).toBe('ACTIVO');
        expect(result2).toBe('CESADO');
        expect(result3).toBe('SIN CONTRATO');
    });

    it('should get item by scss', () => {
        const mockNum1 = 1;
        const mockNum2 = 2;
        const mockNum3 = 3;

        const result1 = component.getItemByScss(mockNum1);
        const result2 = component.getItemByScss(mockNum2);
        const result3 = component.getItemByScss(mockNum3);

        expect(result1).toBe('background-color: green');
        expect(result2).toBe('background-color: red');
        expect(result3).toBe('background-color: #b0a700');
    });

    // it('should export data', () => {
    //   const mockListadoResult = [
    //     { id: 1, name: 'item1' },
    //     { id: 2, name: 'item2' },
    //   ];
    //   const exportToExcelGenericoSpy = spyOn(excelService, 'exportToExcelGenerico');

    //   component.listadoResult = mockListadoResult;

    //   component.exportarDatos();

    //   expect(exportToExcelGenericoSpy).toHaveBeenCalledWith(mockListadoResult, 'trabajadores');
    // });
});

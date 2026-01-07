import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { HomeViewModel } from './home.viewmodel';
import { ScreenType } from 'src/utils/check-screen-size';
import { LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { ExtratoComponent } from 'src/app/home/extrato/extrato.component';
import { NewTransactionCardComponent } from './new-transaction-card/new-transaction-card.component';
import { WelcomeCardComponent } from './welcome-card/welcome-card.component';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { fakeAsync, tick } from '@angular/core/testing';
import { EyeFill, EyeInvisibleFill } from '@ant-design/icons-angular/icons';

registerLocaleData(localePt);

const icons = [
  EyeFill,
  EyeInvisibleFill,
];

class HomeViewModelMock {
  private screenTypeSubject = new BehaviorSubject<ScreenType>('desktop');
  screenType$ = this.screenTypeSubject.asObservable();

  setScreenType(type: ScreenType) {
    this.screenTypeSubject.next(type);
  }
}

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let vmMock: HomeViewModelMock;

  beforeEach(async () => {
    vmMock = new HomeViewModelMock();

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterModule,
        NzLayoutModule,
        NzCardModule,
        NzButtonModule,
        NzIconModule,
        NzDividerModule,
        ReactiveFormsModule,
        FormsModule,
        ExtratoComponent,
        WelcomeCardComponent,
        NewTransactionCardComponent,
        NoopAnimationsModule
      ]
    }).overrideComponent(HomeComponent, {
      set: {
        providers: [
          { provide: HomeViewModel, useValue: vmMock },
          { provide: LOCALE_ID, useValue: 'pt-BR' },
        ]
      }
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render desktop layout when screenType is desktop', fakeAsync(() => {
    vmMock.setScreenType('desktop');
    fixture.detectChanges();
    
    tick(100);
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.desktopLayout'));
    expect(container).toBeTruthy();
  }));

  it('should render mobile layout when screenType is mobile', () => {
    vmMock.setScreenType('mobile');
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.mobileLayout'));
    expect(container).toBeTruthy();
  });

  it('should render tablet layout as mobileLayout', () => {
    vmMock.setScreenType('tablet');
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.mobileLayout'));
    expect(container).toBeTruthy();
  });

  it('should render WelcomeCard, NewTransactionCard and Extrato components', () => {
    const welcomeCard = fixture.debugElement.query(By.css('app-welcome-card'));
    const newTransactionCard = fixture.debugElement.query(By.css('app-new-transaction-card'));
    const extrato = fixture.debugElement.query(By.css('app-extrato'));

    expect(welcomeCard).toBeTruthy();
    expect(newTransactionCard).toBeTruthy();
    expect(extrato).toBeTruthy();
  });
});

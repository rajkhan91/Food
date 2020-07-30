import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllowLocationPage } from './allow-location.page';

describe('AllowLocationPage', () => {
  let component: AllowLocationPage;
  let fixture: ComponentFixture<AllowLocationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllowLocationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllowLocationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

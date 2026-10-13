import { Component, OnDestroy, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/angular';
import { Motion } from '@capacitor/motion';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.page.html',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    CommonModule,
    FormsModule,
  ],
})
export class DicePage implements OnInit, OnDestroy {
  public diceValue: number = 1;
  public isRolling: boolean = false;
  private lastRollTime: number = 0;
  private motionListener: any;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  async ngOnInit() {
    await this.startMotionListener();
  }

  async ngOnDestroy() {
    if (this.motionListener) {
      await this.motionListener.remove();
    }
  }

  async startMotionListener() {
    try {
      this.motionListener = await Motion.addListener('accel', (event) => {
        if (event.acceleration && event.acceleration.x) {
          if (Math.abs(event.acceleration.x) > 5) {
            this.triggerRoll();
          }
        }
      });
    } catch (error) {
      console.error('Motion sensor not available', error);
    }
  }

  public async triggerRoll() {
    const now = Date.now();
    // 500ms debounce/throttle
    if (now - this.lastRollTime > 500) {
      this.lastRollTime = now;
      this.rollDice();
    }
  }

  public async rollDice() {
    if (this.isRolling) return;
    this.isRolling = true;

    // Trigger haptics without 'await' so it doesn't accidentally pause execution on emulators
    Haptics.impact({ style: ImpactStyle.Heavy }).catch(error => {
      console.error('Haptics not available', error);
    });

    let shuffles = 0;
    const maxShuffles = 15;

    // Run inside NgZone to guarantee Angular catches the changes
    this.ngZone.run(() => {
      const interval = setInterval(() => {
        this.diceValue = Math.floor(Math.random() * 6) + 1;
        this.cdr.detectChanges(); 
        
        shuffles++;
        
        if (shuffles >= maxShuffles) {
          clearInterval(interval);
          this.isRolling = false;
        }
      }, 50);
    });
  }
}

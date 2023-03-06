import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  constructor(private overlay: Overlay) {}

  private overlayRef: OverlayRef | undefined;

  public show(duration = 250) {
    if (this.overlayRef) {
      return;
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      panelClass: 'spinner-overlay',
    });

    const portal = new ComponentPortal(SpinnerComponent);

    this.overlayRef.attach(portal);
  }

  public hide() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}

import { Transmission, TransmissionType } from '../parser';
import { Detector } from './detector';

export class IncompleteReadbackDetector extends Detector {
  type = 'Incomplete Readback';

  detect(transmission: Transmission, state: Transmission[]): boolean {
    if (transmission.type !== TransmissionType.Readback) {
      return false;
    }

    const issuances = state
      .reverse()
      .filter((i) => i.target === transmission.source);

    return true;
  }
}

import { Transmission, TransmissionType } from '../parser';
import { Detector } from './detector';

export class MistakenCallsignDetector extends Detector {
  type = 'Mistaken Callsign';

  detect(transmission: Transmission, state: Transmission[]): boolean {
    // Only detect mistaken callsign in readback
    if (transmission.type !== TransmissionType.Readback) {
      return false;
    }

    // Find most recent transmission with
    const issuance = state.reverse().find((issuance) => {
      if (issuance.type !== TransmissionType.Issuance) {
        return false;
      }

      if (transmission.instructions.length !== issuance.instructions.length) {
        return false;
      }

      for (const instruction of transmission.instructions) {
        const issuedInstruction = issuance.instructions.find(
          (i) => i.type === instruction.type,
        );
        if (!issuedInstruction) {
          return false;
        }

        if (
          instruction.specifiers.length !== issuedInstruction.specifiers.length
        ) {
          return false;
        }

        for (const specifier of instruction.specifiers) {
          const issuedSpecifier = issuedInstruction.specifiers.find(
            (s) => s.type === specifier.type,
          );
          if (!issuedSpecifier) {
            return false;
          }

          if (specifier.value !== issuedSpecifier.value) {
            return false;
          }
        }
      }

      return true;
    });

    if (!issuance) {
      return false;
    }

    return transmission.source !== issuance?.target;
  }
}

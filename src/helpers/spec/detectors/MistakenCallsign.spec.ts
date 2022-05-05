import { MistakenCallsignDetector } from '../../detectors/MistakenCallsign';
import {
  InstructionType,
  SpecifierType,
  Transmission,
  TransmissionType,
} from '../../parser';

describe('MistakenCallsignDetector', () => {
  const detector = new MistakenCallsignDetector();

  it('should detect a mistaken callsign', () => {
    const transmission: Transmission = {
      instructions: [
        {
          type: InstructionType.ClearedLanding,
          specifiers: [
            {
              type: SpecifierType.Runway,
              value: 'ONE SIX',
            },
          ],
        },
      ],
      type: TransmissionType.Readback,
      source: 'SKYHAWK SEVEN THREE ONE FOUR SIX',
    };

    const state: Transmission[] = [
      {
        instructions: [
          {
            type: InstructionType.ClearedLanding,
            specifiers: [
              {
                type: SpecifierType.Runway,
                value: 'ONE SIX',
              },
            ],
          },
        ],
        type: TransmissionType.Issuance,
        target: 'SKYHAWK SEVEN THREE FOUR ONE SIX',
      },
    ];

    expect(detector.detect(transmission, state)).toBe(true);
  });
});

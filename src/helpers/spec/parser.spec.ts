import * as parser from '../parser';

describe('Parser', () => {
  describe('clearedForTakeoff', () => {
    it('should parse a simple issuance', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX CLEARED TAKEOFF RUNWAY THREE THREE';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.ClearedTakeoff,
            specifiers: [
              {
                type: parser.SpecifierType.Runway,
                value: 'THREE THREE',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a simple readback', () => {
      const transmission =
        'CLEARED FOR TAKEOFF RUNWAY THREE THREE SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.ClearedTakeoff,
            specifiers: [
              {
                type: parser.SpecifierType.Runway,
                value: 'THREE THREE',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });

    // pilots will occasionally use the runway number without the "RUNWAY" prefix
    it('should parse a simple readback without "RUNWAY"', () => {
      const transmission =
        'CLEARED FOR TAKEOFF THREE THREE SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.ClearedTakeoff,
            specifiers: [
              {
                type: parser.SpecifierType.Runway,
                value: 'THREE THREE',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });

  describe('clearedForLanding', () => {
    it('should parse a simple issuance', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX CLEARED TO LAND RUNWAY ONE SEVEN RIGHT';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.ClearedLanding,
            specifiers: [
              {
                type: parser.SpecifierType.Runway,
                value: 'ONE SEVEN RIGHT',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a simple readback', () => {
      const transmission =
        'CLEARED FOR LANDING RUNWAY ONE SEVEN RIGHT SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.ClearedLanding,
            specifiers: [
              {
                type: parser.SpecifierType.Runway,
                value: 'ONE SEVEN RIGHT',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });

  describe('climb', () => {
    it('should parse a simple issuance', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX CLIMB AND MAINTAIN ONE FOUR THOUSAND';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Climb,
            specifiers: [
              {
                type: parser.SpecifierType.Altitude,
                value: 'ONE FOUR THOUSAND',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a simple readback', () => {
      const transmission =
        'UP TO ONE FOUR THOUSAND SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Climb,
            specifiers: [
              {
                type: parser.SpecifierType.Altitude,
                value: 'ONE FOUR THOUSAND',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });

  describe('descend', () => {
    it('should parse a simple issuance', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX DESCEND TO FLIGHT LEVEL TWO ZERO ZERO';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Descend,
            specifiers: [
              {
                type: parser.SpecifierType.FlightLevel,
                value: 'TWO ZERO ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a simple readback', () => {
      const transmission =
        'DESCENDING TO FLIGHT LEVEL TWO ZERO ZERO SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Descend,
            specifiers: [
              {
                type: parser.SpecifierType.FlightLevel,
                value: 'TWO ZERO ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });

  describe('turn', () => {
    it('should parse a simple issuance', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX TURN LEFT HEADING TWO ZERO ZERO';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Turn,
            specifiers: [
              {
                type: parser.SpecifierType.Direction,
                value: 'LEFT',
              },
              {
                type: parser.SpecifierType.Heading,
                value: 'TWO ZERO ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a simple readback', () => {
      const transmission =
        'LEFT TWO ZERO ZERO SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Turn,
            specifiers: [
              {
                type: parser.SpecifierType.Direction,
                value: 'LEFT',
              },
              {
                type: parser.SpecifierType.Heading,
                value: 'TWO ZERO ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });

  describe('multiple instructions', () => {
    it('should parse an issuance with multiple instructions', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX DESCEND FLIGHT LEVEL ONE NINER ZERO TURN LEFT HEADING ZERO SIX ZERO';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Descend,
            specifiers: [
              {
                type: parser.SpecifierType.FlightLevel,
                value: 'ONE NINER ZERO',
              },
            ],
          },
          {
            type: parser.InstructionType.Turn,
            specifiers: [
              {
                type: parser.SpecifierType.Direction,
                value: 'LEFT',
              },
              {
                type: parser.SpecifierType.Heading,
                value: 'ZERO SIX ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a readback with multiple instructions', () => {
      const transmission =
        'DESCENDING TO FLIGHT LEVEL ONE NINER ZERO LEFT HEADING ZERO SIX ZERO SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Descend,
            specifiers: [
              {
                type: parser.SpecifierType.FlightLevel,
                value: 'ONE NINER ZERO',
              },
            ],
          },
          {
            type: parser.InstructionType.Turn,
            specifiers: [
              {
                type: parser.SpecifierType.Direction,
                value: 'LEFT',
              },
              {
                type: parser.SpecifierType.Heading,
                value: 'ZERO SIX ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });

  describe('filler words', () => {
    it('should parse an issuance with multiple instructions and filler words', () => {
      const transmission =
        'SKYHAWK SEVEN THREE ONE FOUR SIX DESCEND FLIGHT LEVEL ONE NINER ZERO AND UH TURN LEFT HEADING ZERO SIX ZERO';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Descend,
            specifiers: [
              {
                type: parser.SpecifierType.FlightLevel,
                value: 'ONE NINER ZERO',
              },
            ],
          },
          {
            type: parser.InstructionType.Turn,
            specifiers: [
              {
                type: parser.SpecifierType.Direction,
                value: 'LEFT',
              },
              {
                type: parser.SpecifierType.Heading,
                value: 'ZERO SIX ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Issuance,
      } as parser.Transmission);
    });

    it('should parse a readback with multiple instructions and filler words', () => {
      const transmission =
        'UH DESCENDING TO FLIGHT LEVEL ONE NINER ZERO AND TURNING LEFT HEADING ZERO SIX ZERO SKYHAWK SEVEN THREE ONE FOUR SIX';

      expect(parser.parseTransmission(transmission)).toEqual({
        instructions: [
          {
            type: parser.InstructionType.Descend,
            specifiers: [
              {
                type: parser.SpecifierType.FlightLevel,
                value: 'ONE NINER ZERO',
              },
            ],
          },
          {
            type: parser.InstructionType.Turn,
            specifiers: [
              {
                type: parser.SpecifierType.Direction,
                value: 'LEFT',
              },
              {
                type: parser.SpecifierType.Heading,
                value: 'ZERO SIX ZERO',
              },
            ],
          },
        ],
        type: parser.TransmissionType.Readback,
      } as parser.Transmission);
    });
  });
});

export enum SpecifierType {
  Runway = 'runway', // Runway 17, Runway 18L
  Speed = 'speed', // 150 knots, 250 knots
  Altitude = 'altitude', // 24 thousand, 5 thousand 400
  FlightLevel = 'flightLevel', // FL 240, FL 330
  Heading = 'heading', // 100, 240
  Bearing = 'bearing',
  Direction = 'direction', // left, right
  Other = 'other',
}

export enum InstructionType {
  ClearedTakeoff = 'clearedTakeoff',
  ClearedLanding = 'clearedLanding',
  ClearedApproach = 'clearedApproach',
  Taxi = 'taxi',
  HoldShort = 'holdShort',
  Climb = 'climb',
  Descend = 'descend',
  Turn = 'turn',
}

export enum TransmissionType {
  Issuance = 'issuance',
  Readback = 'readback',
}

export interface Specifier {
  type: SpecifierType;
  value: string;
}

export interface Instruction {
  type: InstructionType;
  specifiers: Specifier[];
}

export interface Transmission {
  type: TransmissionType;
  instructions: Instruction[];

  source?: string;
  target?: string;
}

const INSTRUCTION_SEARCH = {
  [InstructionType.ClearedTakeoff]: [
    'CLEARED TO TAKEOFF',
    'CLEARED FOR TAKEOFF',
    'CLEARED TAKEOFF',
  ],
  [InstructionType.ClearedLanding]: [
    'CLEARED TO LAND',
    'CLEARED FOR LANDING',
    'CLEARED LANDING',
  ],
  [InstructionType.ClearedApproach]: [
    /CLEARED\s*(FOR (THE)?)?\s*APPROACH/,
    /CLEARED\s*(FOR (THE)?)?\s*(?<type>VISUAL)/,
    /CLEARED\s*(FOR (THE)?)?\s*(?<type>ILS)/,
    /CLEARED\s*(FOR (THE)?)?\s*(?<type>RNAV)/,
    /CLEARED\s*(FOR (THE)?)?\s*(?<type>GPS)/,
    /CLEARED\s*(FOR (THE)?)?\s*(?<type>LOCALIZER)/,
  ],
  [InstructionType.Taxi]: ['TAXI VIA', 'TAXIING VIA'],
  [InstructionType.HoldShort]: ['HOLD SHORT', 'HOLDING SHORT'],
  [InstructionType.Climb]: ['UP TO', 'CLIMB AND MAINTAIN', /CLIMB(ING)?( TO)?/],
  [InstructionType.Descend]: [
    'DOWN TO',
    'DESCEND AND MAINTAIN',
    /DESCEND(ING)?( TO)?/,
  ],
  [InstructionType.Turn]: [
    /(TURN(ING)?)\s*(?<direction>LEFT|RIGHT)?\s*((HEADING)?\s((?<heading>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE)\s*){2,3}))|((?<bearing>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE)\s*)+) DEGREES))/,
    /(TURN(ING)?)?\s*(?<direction>LEFT|RIGHT)\s*((HEADING)?\s((?<heading>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE)\s*){2,3}))|((?<bearing>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE)\s*)+) DEGREES))/,
    // /(?<direction>LEFT|RIGHT)/,
  ],
};

const IGNORED_WORDS = ['UH', 'UM', 'OKAY'];

export function getSpecifiers(
  instructionType: InstructionType,
  text: string,
  parsedSpecifiers?: { [type: string]: string },
): Specifier[] {
  const specifiers: Specifier[] = [];

  if (parsedSpecifiers) {
    for (const specifier in parsedSpecifiers) {
      if (
        parsedSpecifiers[specifier] &&
        Object.values(SpecifierType).includes(specifier as SpecifierType)
      ) {
        specifiers.push({
          type: specifier as SpecifierType,
          value: parsedSpecifiers[specifier].trim(),
        });
      }
    }
  }

  if (
    instructionType === InstructionType.ClearedTakeoff ||
    instructionType === InstructionType.ClearedLanding
  ) {
    const runwayText =
      /^(RUNWAY )?(?<runway>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE)\s*){1,2}(LEFT|RIGHT|CENTER)?)\b/i.exec(
        text,
      )?.groups?.runway;
    if (runwayText) {
      specifiers.push({
        type: SpecifierType.Runway,
        value: runwayText.trim(),
      });
    }
  }

  if (
    instructionType === InstructionType.Climb ||
    instructionType === InstructionType.Descend
  ) {
    const altitudeText =
      /^(?<altitude>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE|THOUSAND|HUNDRED)\s*)+)/i.exec(
        text,
      )?.groups?.altitude;
    if (altitudeText) {
      specifiers.push({
        type: SpecifierType.Altitude,
        value: altitudeText.trim(),
      });
    }

    const flightLevelText =
      /^FLIGHT LEVEL (?<flightLevel>((ZERO|ONE|TWO|TREE|THREE|FOUR|FIFE|FIVE|SIX|SEVEN|EIGHT|NINER|NINE)\s*)+)/i.exec(
        text,
      )?.groups?.flightLevel;
    if (flightLevelText) {
      specifiers.push({
        type: SpecifierType.FlightLevel,
        value: flightLevelText.trim(),
      });
    }
  }

  return specifiers;
}

export function parseTransmission(text: string): Transmission {
  // Ensure text is consistent for parsing
  text = text.toUpperCase();

  // Remove all ignored words
  for (const ignoredWord of IGNORED_WORDS) {
    text = text.replace(new RegExp(ignoredWord, 'g'), '').trim();
  }

  let type = TransmissionType.Issuance;
  const instructions: Instruction[] = [];

  for (const instructionType in INSTRUCTION_SEARCH) {
    const searchTerms = INSTRUCTION_SEARCH[instructionType as InstructionType];

    let previousInstructions = instructions.length;

    let parts: string[] = [];

    for (const searchTerm of searchTerms) {
      if (typeof searchTerm === 'string') {
        if (text.includes(searchTerm)) {
          parts = text.split(searchTerm).map((i) => i.trim());

          instructions.push({
            type: instructionType as InstructionType,
            specifiers: getSpecifiers(
              instructionType as InstructionType,
              parts[1],
            ),
          });

          break;
        }
      } else {
        const res = (searchTerm as RegExp).exec(text);

        if (res) {
          parts = text.split(res[0]).map((i) => i.trim());

          instructions.push({
            type: instructionType as InstructionType,
            specifiers: getSpecifiers(
              instructionType as InstructionType,
              parts[1],
              res.groups,
            ),
          });

          break;
        }
      }
    }

    if (
      previousInstructions === 0 &&
      instructions.length === 1 &&
      parts[0]?.length === 0
    ) {
      type = TransmissionType.Readback;
    }
  }

  return { type, instructions };
}

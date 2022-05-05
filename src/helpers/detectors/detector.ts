import { Transmission } from '../parser';

export abstract class Detector {
  public abstract type: string;

  /**
   *
   * @param transmission current transmission
   * @param state array of previous tranmissions, not including the current one (oldest first)
   */
  abstract detect(transmission: Transmission, state: Transmission[]): boolean;
}

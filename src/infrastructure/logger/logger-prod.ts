import "reflect-metadata";
import { injectable } from "inversify";
import { ILogger } from "../interfaces/logger";
import { logger } from "../../utils/winston";

@injectable()
export class LoggerProd implements ILogger {
  info(message: string) {
    logger.info(message);
  }

  error(message: string) {
    logger.error(message);
  }
}
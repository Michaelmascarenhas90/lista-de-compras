import { errorMessages } from "@shared/errorHandler/enums/error-messages";

interface StackConfigurator {
  inFunction: (functionName: string) => StackConfigurator;
  inCodeBlock: (codeBlock: string) => StackConfigurator;
  setActualTime: () => StackConfigurator;
  buildStack: () => { getStack: () => string };
}

class ErrorsImpl {
  private stack = "";

  public names = {
    NOT_FOUND: "NOT_FOUND",
    UNAUTHORIZED: "UNAUTHORIZED",
    BAD_REQUEST: "BAD_REQUEST",
    FORBIDDEN: "FORBIDDEN",
    CONFLICT: "CONFLICT",
    PRECONDITION_FAILED: "PRECONDITION_FAILED",
    TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
    SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  } as const;

  public messages = errorMessages;

  /** Stack automático: captura o stack real, remove node_modules e colapsa quebras. */
  setStackAuto(): { getStack: () => string } {
    const { stack } = new Error();
    this.stack = (stack ?? "")
      .replace(/.*[\\/]node_modules[\\/].*/gm, "")
      .replace(/\n+/g, "\n");
    return { getStack: () => this.stack };
  }

  /** Stack manual/descritivo, encadeável. */
  setStack(filePath: string): StackConfigurator {
    this.stack = `File: ${filePath}\n`;
    return this.createStackConfigurator();
  }

  private createStackConfigurator(): StackConfigurator {
    return {
      inFunction: (fn) => {
        this.stack += `at ${fn} `;
        return this.createStackConfigurator();
      },
      inCodeBlock: (code) => {
        this.stack += `in ${code}\n`;
        return this.createStackConfigurator();
      },
      setActualTime: () => {
        this.stack += `(Actual Time: ${new Date().toISOString()})\n`;
        return this.createStackConfigurator();
      },
      buildStack: () => ({ getStack: () => this.stack }),
    };
  }

  /** Usado por crossServicesErr: mantém o stack original ou gera um automático. */
  handleCrossServicesStack(stack: string | undefined): string {
    return stack || this.setStackAuto().getStack();
  }
}

export const errors = new ErrorsImpl();

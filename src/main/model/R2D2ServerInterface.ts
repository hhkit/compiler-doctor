

export namespace R2D2 {
  export interface FileLineCol {
    filename: string;
    line: number;
    column: number;
  }

  export enum TraceDirection {
    Backward = "back",
    Forward = "fwd",
  }

  export interface TraceRequest {
    source: FileLineCol;
    traceDirection: TraceDirection;
    maxDepth: number;
  }

  export interface TraceResponse {
    locations: FileLineCol[];
  }

  export type Methods = {
    "r2d2/load"(params: string): "success" | "failure";
    "r2d2/trace"(params: TraceRequest): TraceResponse;
  }
}

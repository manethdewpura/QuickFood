export class CircuitBreaker {
  constructor(services) {
    this.states = {};
    services.forEach(({ route }) => {
      this.states[route] = {
        state: "CLOSED",
        failures: 0,
        lastFailure: null,
        failureThreshold: 5,
        resetTimeout: 60000,
      };
    });
  }

  checkCircuit(route) {
    const circuit = this.states[route];
    if (circuit.state === "OPEN") {
      if (Date.now() - circuit.lastFailure >= circuit.resetTimeout) {
        circuit.state = "HALF-OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }
    return circuit;
  }

  recordSuccess(route) {
    const circuit = this.states[route];
    circuit.failures = 0;
    circuit.state = "CLOSED";
  }

  recordFailure(route) {
    const circuit = this.states[route];
    circuit.failures++;
    circuit.lastFailure = Date.now();
    if (circuit.failures >= circuit.failureThreshold) {
      circuit.state = "OPEN";
    }
  }
}

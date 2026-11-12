import http from "k6/http";
import { check, sleep } from "k6";
import exec from "k6/execution";

const baseUrl = __ENV.BASE_URL || "http://127.0.0.1:3000";

export const options = {
  scenarios: {
    read_endpoints: {
      executor: "constant-vus",
      vus: 20,
      duration: "30s",
    },
  },
  thresholds: {
    http_req_duration: ["p(95)<1000"],
    http_req_failed: ["rate<0.01"],
    checks: ["rate>0.99"],
  },
};

export default function () {
  const path =
    exec.vu.iterationInScenario % 2 === 0
      ? "/api/v1/status"
      : "/api/v1/courses";
  const response = http.get(`${baseUrl}${path}`);

  check(response, {
    [`GET ${path} responds with 200`]: (result) => result.status === 200,
  });

  sleep(1);
}

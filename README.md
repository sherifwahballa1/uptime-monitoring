# Backend Assessment

The main idea of the task is to build an uptime monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.

## Features

- Sign-up with email verification.
- Stateless authentication using JWT.
- Users can create a check to monitor a given URL if it is up or down.
- Users can edit, pause, or delete their checks if needed.
- Users may receive a notification on a webhook URL by sending HTTP POST request whenever a check goes down or up.
- Users should receive email alerts whenever a check goes down or up.
- Users can get detailed uptime reports about their checks availability, average response time, and total uptime/downtime.
- Users can group their checks by tags and get reports by tag.

## Acceptance Criteria

- Each check may have the following options:
  - `name` - The name of the check.
  - `url` - The URL to be monitored.
  - `protocol` - The resource protocol name `HTTP`, `HTTPS`, or `TCP`.
  - `path` - A specific path to be monitored (optional).
  - `port` - The server port number (optional).
  - `webhook` - A webhook URL to receive a notification on (optional).
  - `timeout` (defaults to 5 seconds) - The timeout of the polling request (optional).
  - `interval` (defaults to 10 minutes) - The time interval for polling requests (optional).
  - `threshold` (defaults to 1 failure) - The threshold of failed requests that will create an alert (optional).
  - `authentication` - An HTTP authentication header, with the Basic scheme, to be sent with the polling request (optional).
    - `authentication.username`
    - `authentication.password`
  - `httpHeaders` - A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
  - `assert` - The response assertion to be used on the polling response (optional).
    - `assert.statusCode`: An HTTP status code to be asserted.
  - `tags` - A list of the check tags (optional).
  - `ignoreSSL` - A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.

- Each report may have the following information:
  - `status` - The current status of the URL.
  - `availability` - A percentage of the URL availability.
  - `outages` - The total number of URL downtimes.
  - `downtime` - The total time, in seconds, of the URL downtime.
  - `uptime` - The total time, in seconds, of the URL uptime.
  - `responseTime` - The average response time for the URL.
  - `history` - Timestamped logs of the polling requests.

## Expectations

- Code quality.
- Code scalability as we should be able to add a new alerting notification channel like Slack, Firebase, SMS, etc.. with the minimum possible changes.
- Unit tests.

## Bonus

- Swagger API documentation.
- Code linting.
- Docker.
- [Pushover](https://pushover.net/) integration to receive alerts on mobile devices.

Try your best to implement as much as you can from the given features and feel free to add more if you want to.

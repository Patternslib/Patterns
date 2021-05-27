# Push tools

Here are some tools to help you test the push pattern.

## Precondition

- GNU make
- Docker
- Python 3

## Start

1. Start the webpack dev server with ``yarn start`` in the root of the Patternslib directory.

2. Start the RabbitMQ server via Docker just by invoking ``make start``.

3. Navigate to: ``http://0.0.0.0:3001/src/pat/push/index.html``

4. Send a message my invoking ``make send-update-1`` or ``make send-update-2``.
   The counter in the example should update.


Stop the Docker instance by ``make stop``.
Check the logs with ``make log``.

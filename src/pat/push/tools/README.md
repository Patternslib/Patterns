# Push tools

Here are some tools to help you test the push pattern.

1) Bootstrap a python environment in the tools directory:
  ``./initpython.sh``

2) Start the rabbitmq docker container for the first time with ``rabbitmq_start.sh``.
   After that you can run the docker container with ``docker start rabbitmq``.

3) Start the webpack dev server with ``yarn start`` in the root of the Patternslib directory.

4) Navigate to: ``http://0.0.0.0:3001/src/pat/push/index.html``

5) Send some messages to rabbitmq to update the message counters on the test page:
   ``./bin/python send.py push_marker message_counter``
   and
   ``./bin/python send.py push_marker message_counter2``

